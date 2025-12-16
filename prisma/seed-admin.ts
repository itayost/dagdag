import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!password) {
    console.error('❌ ADMIN_PASSWORD environment variable is required');
    console.log('Set it with: ADMIN_PASSWORD=your-secure-password npx tsx prisma/seed-admin.ts');
    process.exit(1);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin user
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log('✅ Admin user created successfully:');
  console.log(`Email: ${admin.email}`);
  console.log(`Name: ${admin.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
