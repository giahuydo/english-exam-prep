import { Injectable, NotImplementedException } from '@nestjs/common';

export interface PdfExtractor {
  extract(fileBuffer: Buffer): Promise<string>;
}
export const PDF_EXTRACTOR = Symbol('PDF_EXTRACTOR');

@Injectable()
export class NoopPdfExtractor implements PdfExtractor {
  async extract(_fileBuffer: Buffer): Promise<string> {
    throw new NotImplementedException('PdfExtractor not implemented — plug a real backend in.');
  }
}
