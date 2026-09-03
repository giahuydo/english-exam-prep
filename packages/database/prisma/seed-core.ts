import { PrismaClient } from '../src/generated/prisma';
import { seedCore } from './seed/core';

const prisma = new PrismaClient();
seedCore(prisma)
  .then(() => console.log('Core seed complete.'))
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
