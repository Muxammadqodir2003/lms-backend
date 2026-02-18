import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userEmail = 'aralxanovmuxammadqodir4@gmail.com';
  const updatedUser = await prisma.user.update({
    where: { email: userEmail },
    data: { role: 'ADMIN' },
  });
  console.log('Muvaffaqiyatli yangilandi:', updatedUser);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
