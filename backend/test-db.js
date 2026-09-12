const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

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
