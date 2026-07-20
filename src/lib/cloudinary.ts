import { v2 as cloudinary } from 'cloudinary';
import { getPublicIdFromUrl } from '@/lib/cloudinary-client';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  console.warn('⚠️ Cloudinary environment variables are not configured.');
}

export default cloudinary;

/**
 * Uploads a file buffer to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'protibae',
  options: { publicId?: string } = {}
) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

/**
 * Deletes an asset from Cloudinary using its public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

/**
 * Renames/moves an asset in Cloudinary
 */
export async function renameCloudinaryAsset(fromPublicId: string, toPublicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.rename(fromPublicId, toPublicId, { overwrite: true }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

/**
 * Checks if any image in the array is in the temp folder, moves it to the target folder,
 * and returns the updated array of secure URLs.
 */
export async function organizeProductImages(
  images: string[],
  productSlug: string
): Promise<string[]> {
  if (!productSlug || productSlug === 'temp') return images;
  
  const organizedImages: string[] = [];

  for (const url of images) {
    if (url.includes('/protibae/products/temp/')) {
      const oldPublicId = getPublicIdFromUrl(url);
      if (oldPublicId) {
        // Extract filename from oldPublicId (e.g. "protibae/products/temp/filename" -> "filename")
        const parts = oldPublicId.split('/');
        const filename = parts[parts.length - 1];
        const newPublicId = `protibae/products/${productSlug}/${filename}`;
        
        try {
          console.log(`Moving images:\ntemp\n→\nprotibae/products/${productSlug}/`);
          // Rename asset in Cloudinary to move to slug folder
          const result = await renameCloudinaryAsset(oldPublicId, newPublicId) as any;
          if (result && result.secure_url) {
            organizedImages.push(result.secure_url);
            continue;
          }
        } catch (error) {
          console.error(`❌ Failed to rename Cloudinary asset from ${oldPublicId} to ${newPublicId}:`, error);
        }
      }
    }
    organizedImages.push(url);
  }

  return organizedImages;
}

/**
 * Deletes all resources in a product's folder, then deletes the folder itself
 */
export async function deleteProductFolder(productSlug: string): Promise<void> {
  if (!productSlug || productSlug === 'temp') return;
  const folderPath = `protibae/products/${productSlug}`;
  try {
    // 1. Delete all resources with the prefix (images inside the folder)
    await new Promise((resolve, reject) => {
      cloudinary.api.delete_resources_by_prefix(`${folderPath}/`, (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result);
      });
    });

    // 2. Delete the empty folder in Cloudinary
    await new Promise((resolve, reject) => {
      cloudinary.api.delete_folder(folderPath, (error: any, result: any) => {
        // Ignore folder not found error (if it was already empty or not created yet)
        if (error && error.http_code !== 404) return reject(error);
        resolve(result);
      });
    });
  } catch (error) {
    console.error(`❌ Failed to delete Cloudinary folder for product ${productSlug}:`, error);
  }
}

/**
 * Deletes the temporary products folder in Cloudinary if it is empty.
 */
export async function cleanTempFolder(): Promise<void> {
  try {
    await new Promise((resolve) => {
      cloudinary.api.delete_folder('protibae/products/temp', (error: any, result: any) => {
        // Ignore any errors (e.g. folder not empty, folder not found)
        resolve(result);
      });
    });
  } catch (error) {
    // Ignore error
  }
}
