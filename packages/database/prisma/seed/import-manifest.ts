import { readFile } from 'node:fs/promises';
import { PrismaClient } from '../src/generated/prisma';
import { importDataset } from './seed/import-dataset';
import type { ExamDataset } from './seed/types';

const file = process.argv[2];
if (!file) throw new Error('Usage: tsx packages/database/prisma/seed/import-manifest.ts <manifest.json>');
const dataset = JSON.parse(await readFile(file, 'utf8')) as ExamDataset;
const prisma = new PrismaClient();
try { console.log(JSON.stringify(await importDataset(prisma, dataset))); } finally { await prisma.$disconnect(); }
