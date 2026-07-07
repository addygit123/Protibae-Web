import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : false,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const chocoPeanut = await prisma.product.upsert({
    where: {
      slug: 'choco-peanut',
    },
    update: {
      name: 'Protibae Choco Peanut',
      description:
        'The ultimate guilt-free indulgence. Packed with protein and rich chocolate peanut flavor.',
      price: 1099,
      compareAtPrice: 1299,
      inventory: 100,
      category: 'Protein Bars',
      flavor: 'Choco Peanut',
      weight: '500g',
      images: ['/products/choco-peanut.jpg'],
      isActive: true,
    },
    create: {
      name: 'Protibae Choco Peanut',
      slug: 'choco-peanut',
      description:
        'The ultimate guilt-free indulgence. Packed with protein and rich chocolate peanut flavor.',
      price: 1099,
      compareAtPrice: 1299,
      sku: 'PB-CHOCO-PEANUT-01',
      inventory: 100,
      category: 'Protein Bars',
      flavor: 'Choco Peanut',
      weight: '500g',
      images: ['/products/choco-peanut.jpg'],
      isActive: true,
    },
  });

  console.log(`✓ Seeded product: ${chocoPeanut.name} (id: ${chocoPeanut.id})`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
