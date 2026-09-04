import Link from 'next/link';
export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">VSTEP Exam Preparation · B1/B2 Target Levels</h1>
      <p className="mt-2 text-gray-700">
        Practice English questions built around VSTEP skills and B1/B2 target levels, with
        HCMUS-oriented preparation contexts where relevant.
      </p>
      <div className="mt-4 flex gap-4">
        <Link className="text-blue-600 underline" href="/login">
          Login
        </Link>
        <Link className="text-blue-600 underline" href="/practice">
          Practice
        </Link>
        <Link className="text-blue-600 underline" href="/admin">
          Admin dashboard
        </Link>
      </div>
    </main>
  );
}
