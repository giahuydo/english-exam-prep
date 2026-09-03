import { PrismaClient } from '../src/generated/prisma';
import { assemblies, datasets } from './seed/index';
import { importDatasets } from './seed/import-dataset';
import { seedAssembly } from './seed/assemblies';

const prisma = new PrismaClient();
Promise.all(assemblies.map((assembly) => seedAssembly(prisma, assembly)))
  .then(() => importDatasets(prisma, datasets))
  .then((totals) => console.log(`Exam seed complete: ${totals.exams} exams, ${totals.questions} questions, ${totals.options} options.`))
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
