'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const price = parseFloat(formData.get('price') as string);
  const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : null;
  const inventory = parseInt(formData.get('inventory') as string, 10);
  const isActive = formData.get('isActive') === 'true';

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        price,
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
