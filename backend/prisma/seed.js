'use strict';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main() {
  const roleDefs = [
    { name: 'SUPER_ADMIN', description: 'Platform-wide administrator' },
    { name: 'COMPANY_ADMIN', description: 'Company administrator' },
    { name: 'HR', description: 'Human Resources manager' },
    { name: 'MANAGER', description: 'Team or department manager' },
    { name: 'EMPLOYEE', description: 'Regular employee' },
  ];
  for (const r of roleDefs) {
    await prisma.role.upsert({ where: { name: r.name }, update: {}, create: r });
    console.log('Role seeded: ' + r.name);
  }
  const now = new Date();
  const workStart = new Date(now); workStart.setHours(9, 0, 0, 0);
  const workEnd = new Date(now); workEnd.setHours(18, 0, 0, 0);
  const superCompany = await prisma.company.upsert({
    where: { slug: 'workflow-pro-platform' },
    update: {},
    create: { name: 'WorkNexus Platform', slug: 'workflow-pro-platform', email: 'superadmin@workflowpro.com', workingDays: ['MON','TUE','WED','THU','FRI'], workingHoursStart: workStart, workingHoursEnd: workEnd },
  });
  const testCompany = await prisma.company.upsert({
    where: { slug: 'test-company' },
    update: {},
    create: { name: 'Test Company', slug: 'test-company', email: 'contact@test.com', workingDays: ['MON','TUE','WED','THU','FRI'], workingHoursStart: workStart, workingHoursEnd: workEnd },
  });
  const pHash = await bcrypt.hash('Password@123', 10);
  const users = [
    { email: 'superadmin@workflowpro.com', role: 'SUPER_ADMIN', company: superCompany, first: 'Super', last: 'Admin' },
    { email: 'admin@test.com', role: 'COMPANY_ADMIN', company: testCompany, first: 'Company', last: 'Admin' },
    { email: 'hr@test.com', role: 'HR', company: testCompany, first: 'HR', last: 'Manager' },
    { email: 'manager@test.com', role: 'MANAGER', company: testCompany, first: 'Team', last: 'Manager' },
    { email: 'employee@test.com', role: 'EMPLOYEE', company: testCompany, first: 'Regular', last: 'Employee' },
  ];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { companyId_email: { companyId: u.company.id, email: u.email } },
      update: { passwordHash: pHash },
      create: { companyId: u.company.id, firstName: u.first, lastName: u.last, email: u.email, passwordHash: pHash },
    });
    const role = await prisma.role.findFirst({ where: { name: u.role } });
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id, companyId: u.company.id },
      });
    }
    console.log('Seeded: ' + u.email);
  }
  console.log('Done! Login: superadmin@workflowpro.com / Password@123');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
