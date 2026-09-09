import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

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
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Fetching admin users...");
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { email: true, name: true }
    });
    console.log("\nAdmin Users:");
    console.table(admins);
    console.log("\nTo reset password, run:");
    console.log("npx tsx scripts/reset-password.ts <email> <new-password>\n");
    return;
  }

  const email = args[0];
  const newPassword = args[1];

  if (!email || !newPassword) {
    console.error('Usage: npx tsx scripts/reset-password.ts <email> <new-password>');
    process.exit(1);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    console.log(`Successfully reset password for ${user.email}`);
  } catch (error) {
    console.error(`Failed to reset password for ${email}:`, error);
  } finally {
    await prisma.$disconnect();
    pool.end();
  }
}

main().catch(console.error);
