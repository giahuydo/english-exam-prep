import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Elevate English', description: 'Focused preparation for B1, B2 and HCMUS entrance English.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
