'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

interface TopicNode {
  id: string;
  code: string;
  name: string;
  category: string;
  children?: TopicNode[];
}

function Tree({ nodes }: { nodes: TopicNode[] }) {
  return (
    <ul className="ml-4 list-disc">
      {nodes.map((n) => (
        <li key={n.id}>
          <span className="font-medium">{n.name}</span>{' '}
          <span className="text-xs text-gray-500">
            [{n.category}/{n.code}]
          </span>
          {n.children && n.children.length > 0 ? <Tree nodes={n.children} /> : null}
        </li>
      ))}
    </ul>
  );
}

export default function AdminTopicsPage() {
  const [tree, setTree] = useState<TopicNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .topicsTree()
      .then((data) => setTree(data as TopicNode[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, []);

  return (
    <section>
      <h1 className="text-xl font-semibold">Topic Taxonomy</h1>
      {error ? <p className="mt-2 text-red-600">{error}</p> : null}
      <div className="mt-4 rounded border bg-white p-4">
        <Tree nodes={tree} />
      </div>
    </section>
  );
}
