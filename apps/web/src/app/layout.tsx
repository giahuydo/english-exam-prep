import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'English B1/B2 Exam Prep',
  description: 'Practice B1/B2 English exam patterns',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b bg-white px-6 py-3 text-sm">
          <nav className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/practice">Practice</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
