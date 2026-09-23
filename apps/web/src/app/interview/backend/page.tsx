import Link from 'next/link';

export default function BackendInterviewPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-6">
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← Home</Link>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Interview practice</span>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white" aria-label="Interview category">
        <div className="mx-auto flex max-w-6xl gap-1 px-3 sm:px-6">
          <Link href="/interview" className="border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-900">AI Interview</Link>
          <Link href="/interview/backend" aria-current="page" className="border-b-2 border-blue-700 px-3 py-3 text-sm font-bold text-blue-700">Backend Interview</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-3 py-8 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Technical interview</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Backend Interview</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Backend and Node.js interview questions will be organized here for focused practice.</p>
        </section>
      </main>
    </div>
  );
}