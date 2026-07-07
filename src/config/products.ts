// Central product data — single source of truth fetched from Prisma
import { prisma } from '@/lib/prisma';
import type { Product as PrismaProduct } from '@prisma/client';

export interface ProductBadge {
  label: string;
  variant: 'primary' | 'secondary' | 'accent' | 'inverse';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;        // display string e.g. "₹83/bar"
  packInfo: string;     // e.g. "Pack of 6/12/24"
  description: string;
  category: 'protein-bars' | 'nuts-seeds' | 'combos';
  badges: ProductBadge[];
  image: string;
  imageAlt: string;
  gallery?: { src: string; alt: string }[];
  ingredients?: string[];
  isFeatured?: boolean;
  isComingSoon?: boolean;
  inventory: number;
}

// Map Prisma product to Client Product UI model
// This handles missing fields temporarily until the DB schema is updated
function mapPrismaToClientProduct(p: PrismaProduct): Product {
  // Temporary mocks for UI fields not yet in DB
  const mockedBadges: ProductBadge[] = [
    { label: '13G Protein', variant: 'primary' },
    { label: 'Low Sugar', variant: 'accent' },
  ];
  
  const mainImage = p.images.length > 0 ? p.images[0] : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfgwOPLhAXvuKJxnVl0xtDu81Y0QsvAKvyCSLZdztbE3-a8akPsmSd-fadjDGMj7HNsnO1ddA9PpDDOe-DbI-akM_4T7nsCA8RP_ifvNQwvwZmpzk3s3rTaXIrnPv-e1oAzutxavkaru7D2iSd6i126CrYiGjSRnd-bsK8AzNH7YsWU9aDcXd9K1JEHfgtH6dDz63hjJpeuALFt3VProMgVHZH5ztimgqR7SVrqb64J_53qfkYdG3XI5CFNWZUnPew611TmYMV-Z8';

  const gallery = p.images.length > 0 ? p.images.map(src => ({ src, alt: p.name })) : [
    { src: mainImage, alt: `${p.name} wrapper` },
    { src: mainImage, alt: `${p.name} standing` },
    { src: mainImage, alt: `${p.name} close up` },
  ];

  const ingredients = [
    'Peanuts',
    'Pea Protein',
    'Dates',
    'Dark Compound',
    'Cocoa Powder',
    'Bajra Crisps',
    'Rosemary Extract'
  ];

  // Convert numeric price to display string (mock logic to match current UI assumption)
  // Assuming p.price is total pack price or unit price? UI expects string "₹83/bar"
  // If price is 999 for pack of 12, then it's ~83/bar. 
  // Let's just create a string formatting it.
  const unitPrice = Math.round(p.price / 12);
  const displayPrice = `₹${unitPrice}/bar`;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: displayPrice,
    packInfo: 'Pack of 6/12/24',
    description: p.description,
    category: p.category as 'protein-bars' | 'nuts-seeds' | 'combos',
    badges: mockedBadges,
    image: mainImage,
    imageAlt: `${p.name} product image`,
    gallery,
    ingredients,
    isFeatured: true,
    isComingSoon: false,
    inventory: p.inventory,
  };
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
  
  return products.map(mapPrismaToClientProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug }
  });
  
  if (!product) return null;
  return mapPrismaToClientProduct(product);
}
