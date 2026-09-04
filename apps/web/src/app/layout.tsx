import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/language';

export const metadata: Metadata = { title: 'Elevate English', description: 'VSTEP preparation with B1 and B2 proficiency targets.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>; }
