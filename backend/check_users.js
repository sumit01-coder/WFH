const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, firstName: true }
  });
  console.log(users);
}

main().finally(() => prisma.$disconnect());
