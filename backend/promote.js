const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'admin@test.com' } });
  if (!user) throw new Error("User not found");
  
  const role = await prisma.role.findUnique({ where: { name: 'COMPANY_ADMIN' } });
  if (!role) throw new Error("Role not found");
  
  // Delete all existing roles for user
  await prisma.userRole.deleteMany({ where: { userId: user.id } });
  
  // Add new role
  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
      companyId: user.companyId
    }
  });
  
  console.log('Successfully promoted admin@test.com to COMPANY_ADMIN');
}
main().catch(console.error).finally(() => prisma.$disconnect());
