const { PrismaClient } = require('@prisma/client');
process.env.DATABASE_URL = 'mysql://u807559357_worknexus:WorkNexus%232026!@109.106.251.107:3306/u807559357_worknexus';

const prisma = new PrismaClient();
prisma.$connect()
  .then(() => {
    console.log('Connected to MySQL successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to connect:', err);
    process.exit(1);
  });
