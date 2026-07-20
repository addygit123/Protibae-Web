import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { getPublicIdFromUrl } from '@/lib/cloudinary-client';

// Allowed mime types
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    // 1. Authorize the user (must be ADMIN)
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // 2. Parse the Form Data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 3. Validate Mime Type & File Size
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Only PNG, JPEG, and WEBP are allowed. Received: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 10MB limit.' },
        { status: 400 }
      );
    }

    // 4. Determine Target Folder
    const requestedFolder = formData.get('folder') as string | null;
    const productSlug = formData.get('productSlug') as string | null;

    // Helper to sanitize paths by trimming whitespace and trailing/leading slashes
    const sanitizePath = (path: string) => {
      return path.trim().replace(/^\/+|\/+$/g, '');
    };

    let folder = 'protibae/products/temp';

    if (productSlug && productSlug.trim() !== '' && productSlug !== 'temp') {
      folder = `protibae/products/${sanitizePath(productSlug)}`;
    } else if (requestedFolder) {
      const cleanFolder = sanitizePath(requestedFolder);
      const allowedFutureFolders = [
        'protibae/hero',
        'protibae/banners',
        'protibae/blog',
        'protibae/categories',
        'protibae/marketing'
      ];

      const isFutureFolder = allowedFutureFolders.some(
        f => cleanFolder === f || cleanFolder.startsWith(`${f}/`)
      );

      if (isFutureFolder) {
        folder = cleanFolder;
      } else if (cleanFolder === 'protibae/products' || cleanFolder.startsWith('protibae/products/')) {
        folder = 'protibae/products/temp';
      } else {
        folder = cleanFolder;
      }
    }

    // Server-side logging for debugging
    console.log(`Received slug:\n${productSlug || 'none'}`);
    console.log(`Uploading to:\n${folder}/`);

    // 5. Convert to Buffer and Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = (await uploadToCloudinary(buffer, folder)) as any;

    if (!result || !result.secure_url) {
      throw new Error('Cloudinary upload returned an empty response.');
    }

    // 6. Return response
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    console.error('❌ Cloudinary Upload API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during upload.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // 1. Authorize the user (must be ADMIN)
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // 2. Parse URL to delete
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required.' }, { status: 400 });
    }

    // 3. Extract publicId
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
      return NextResponse.json(
        { error: 'Could not resolve a valid Cloudinary Public ID from the provided URL.' },
        { status: 400 }
      );
    }

    // 4. Delete from Cloudinary
    const result = await deleteFromCloudinary(publicId);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('❌ Cloudinary Delete API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during deletion.' },
      { status: 500 }
    );
  }
}
