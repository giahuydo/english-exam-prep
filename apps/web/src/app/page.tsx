import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">VSTEP English Prep</h1>
      <p className="mt-2 text-gray-700">
        Build VSTEP skills with B1 and B2 proficiency targets. Add HCMUS-oriented practice as an optional preparation context — not a separate skill framework.
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
