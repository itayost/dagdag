import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@jacko.fish';
  const password = 'admin123'; // Change this in production!
  const name = 'מנהל ראשי';

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

  console.log('Admin user created successfully:');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
