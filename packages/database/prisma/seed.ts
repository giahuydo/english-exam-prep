import { PrismaClient } from '../src/generated/prisma';
import { seedAll } from './seed/index';

const prisma = new PrismaClient();

seedAll(prisma)
  .then((totals) => console.log(`Seed complete: ${totals.exams} exams, ${totals.questions} questions, ${totals.options} options.`))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
