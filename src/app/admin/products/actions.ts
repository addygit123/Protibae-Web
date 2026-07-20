'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { organizeProductImages, deleteProductFolder, cleanTempFolder } from '@/lib/cloudinary';

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const priceStr = formData.get('price') as string;
  const price = priceStr ? parseFloat(priceStr) : 0;
  
  const price6Str = formData.get('price6') as string;
  const price6 = price6Str && price6Str.trim() !== '' ? parseFloat(price6Str) : null;
  
  const compareStr = formData.get('compareAtPrice') as string;
  const compareAtPrice = compareStr && compareStr.trim() !== '' ? parseFloat(compareStr) : null;
  
  const inventory = parseInt(formData.get('inventory') as string, 10) || 0;
  const isActive = formData.get('isActive') === 'true';
  const images = formData.getAll('images') as string[];

  try {
    // 1. Fetch the product to retrieve its slug
    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true }
    });

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // Note: The product slug is intentionally immutable once created to prevent broken links (SEO) and avoid complex folder renaming on Cloudinary.
    // Therefore, we only organize any newly uploaded temp images into the existing slug folder.
    const organizedImages = await organizeProductImages(images, product.slug);

    // 3. Save the product with updated image URLs (but keep original slug)
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        price,
        price6,
        compareAtPrice,
        inventory,
        isActive,
        images: organizedImages
      }
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/shop');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

/**
 * Deletes a product from the database, and if successful, deletes all its images and folder from Cloudinary.
 */
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true }
    });

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // Delete product from database first
    // If it fails due to foreign key constraints (e.g. from OrderItem), we don't delete Cloudinary images.
    await prisma.product.delete({
      where: { id }
    });

    // Delete folder and files from Cloudinary
    if (product.slug) {
      await deleteProductFolder(product.slug);
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

/**
 * Creates a new product, generates a unique slug and SKU, organizes uploaded temp images, and saves to database.
 */
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const priceStr = formData.get('price') as string;
  const price = priceStr ? parseFloat(priceStr) : 0;
  
  const price6Str = formData.get('price6') as string;
  const price6 = price6Str && price6Str.trim() !== '' ? parseFloat(price6Str) : null;
  
  const compareStr = formData.get('compareAtPrice') as string;
  const compareAtPrice = compareStr && compareStr.trim() !== '' ? parseFloat(compareStr) : null;
  
  const inventory = parseInt(formData.get('inventory') as string, 10) || 0;
  const isActive = formData.get('isActive') === 'true';
  const images = formData.getAll('images') as string[];

  // Note: Generate slug from name. Slug remains immutable after creation.
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!slug) slug = 'product-' + Math.random().toString(36).substring(2, 6);

  try {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Generate unique SKU
    let sku = `PB-${slug.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      sku = `PB-${slug.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    // 1. First, create the product using the original temp image URLs
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category,
        price,
        price6,
        compareAtPrice,
        sku,
        inventory,
        isActive,
        images: images
      }
    });

    // 2. Immediately after createProduct() succeeds, call organizeProductImages() to move images
    console.log(`[Actions] createProduct() succeeded for product ID: "${product.id}". Organizing images...`);
    const organizedImages = await organizeProductImages(images, slug);

    // 3. Update all Cloudinary URLs in Prisma
    if (JSON.stringify(images) !== JSON.stringify(organizedImages)) {
      console.log(`[Actions] Updating product URLs in Prisma with organized paths.`);
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: organizedImages
        }
      });
      product.images = organizedImages;
    }

    // 4. Clean up the empty temp folder if possible
    await cleanTempFolder();

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return { success: true, product };
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}
