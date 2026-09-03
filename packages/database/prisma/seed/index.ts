import { PrismaClient } from '../../src/generated/prisma';
import { seedCore } from './core';
import { importDatasets } from './import-dataset';
import { assemblies, seedAssembly } from './assemblies';
import type { ExamDataset } from './types';
import hcmusMock01 from './datasets/hcmus-mock-01';
import hcmusMock02 from './datasets/hcmus-mock-02';
import hcmusMock03 from './datasets/hcmus-mock-03';
import vstepMock01 from './datasets/vstep-mock-01';
import vstepMock02 from './datasets/vstep-mock-02';
import { readingExpansionDatasets } from './datasets/reading-expansion';

export const datasets: ExamDataset[] = [hcmusMock01, hcmusMock02, hcmusMock03, vstepMock01, vstepMock02, ...readingExpansionDatasets];
export { seedCore, importDatasets, assemblies, seedAssembly };

export async function seedAll(prisma: PrismaClient) {
  await seedCore(prisma);
  for (const assembly of assemblies) await seedAssembly(prisma, assembly);
  return importDatasets(prisma, datasets);
}
