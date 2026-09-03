import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">English B1/B2 Exam Prep</h1>
      <p className="mt-2 text-gray-700">
        Practice English B1/B2 questions built from real exam patterns (HCMUS master entrance, VSTEP).
      </p>
      <ul className="mt-4 list-disc pl-6">
        <li>
          <Link className="text-blue-600 underline" href="/login">Login</Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/practice">Practice</Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/admin">Admin dashboard</Link>
        </li>
      </ul>
    </section>
  );
}
