// Facade re-exporting the split AI interfaces so existing imports keep working.
// New code should import from the subdirectory barrels directly.
export * from './pdf-extractor';
export * from './exam-analyzer';
export * from './question-classifier';
export * from './question-generator';
export * from './explanation-generator';
