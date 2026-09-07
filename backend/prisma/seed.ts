import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roleDefs = [
    { name: 'SUPER_ADMIN',   description: 'Platform-wide administrator' },
    { name: 'COMPANY_ADMIN', description: 'Company administrator' },
    { name: 'HR',            description: 'Human Resources manager' },
    { name: 'MANAGER',       description: 'Team or department manager' },
    { name: 'EMPLOYEE',      description: 'Regular employee' },
  ];

  for (const r of roleDefs) {
    await prisma.role.upsert({ where: { name: r.name }, update: {}, create: r });
    console.log('  Seeded role: ' + r.name);
  }

  const superCompany = await prisma.company.upsert({
    where: { slug: 'workflow-pro-platform' },
    update: {},
    create: {
      name: 'WorkFlow Pro Platform',
      slug: 'workflow-pro-platform',
      email: 'superadmin@workflowpro.com',
      workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    },
  });

  const pHash = await bcrypt.hash('SuperAdmin@123', 10);

  const saUser = await prisma.user.upsert({
    where: { companyId_email: { companyId: superCompany.id, email: 'superadmin@workflowpro.com' } },
    update: {},
    create: {
      companyId: superCompany.id,
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@workflowpro.com',
      passwordHash: pHash,
    },
  });

  const saRole = await prisma.role.findFirst({ where: { name: 'SUPER_ADMIN' } });
  if (saRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: saUser.id, roleId: saRole.id } },
      update: {},
      create: { userId: saUser.id, roleId: saRole.id, companyId: superCompany.id },
    });
  }

  console.log('Done! superadmin@workflowpro.com / SuperAdmin@123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
