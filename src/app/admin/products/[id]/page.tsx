import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductEditForm } from '@/components/admin/ProductEditForm';

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return <ProductEditForm product={product} />;
}
