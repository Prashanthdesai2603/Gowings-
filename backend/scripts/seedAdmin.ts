import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gowings.com';
  const adminPassword = 'adminpassword';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('Admin user already exists!');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '1234567890',
      role: 'ADMIN'
    }
  });

  console.log('Admin user created successfully:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
