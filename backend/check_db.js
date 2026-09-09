const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.activityLog.count();
  console.log(`Total ActivityLogs: ${count}`);
  
  if (count > 0) {
    const latest = await prisma.activityLog.findMany({ take: 5, orderBy: { createdAt: 'desc' }});
    console.log('Latest logs:', JSON.stringify(latest, null, 2));
  }
}

main().finally(() => prisma.$disconnect());
