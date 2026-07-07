'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

  try {
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
        isActive
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
