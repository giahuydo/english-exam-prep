'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface TopicRow {
  id: string;
  code: string;
  name: string;
  category: string;
  parentId: string | null;
}

export default function LearnTopicPage({ params }: { params: { topic: string } }) {
  const [topic, setTopic] = useState<TopicRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api
      .listTopics()
      .then((rows) => {
        const list = rows as TopicRow[];
        const match =
          list.find((t) => t.code === params.topic) ?? list.find((t) => t.id === params.topic);
        setTopic(match ?? null);
        if (!match) setError('Topic not found');
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, [params.topic]);

  async function start() {
    if (!topic) return;
    setStarting(true);
    try {
      const res = await api.startPractice({
        mode: 'TOPIC_PRACTICE',
        topicId: topic.id,
        totalQuestions: 10,
      });
      window.location.href = `/practice/${res.session.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'start failed');
    } finally {
      setStarting(false);
    }
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!topic) return <p>Loading...</p>;

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold">{topic.name}</h1>
        <p className="text-sm text-gray-600">
          Category: {topic.category} · Code: {topic.code}
        </p>
      </div>

      <div className="rounded border bg-white p-4">
        <p className="text-sm">
          Study material is not yet wired up. Start a 10-question focused practice session on this
          topic:
        </p>
        <div className="mt-3 flex gap-2">
          <button
            className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
            onClick={start}
            disabled={starting}
          >
            {starting ? 'Starting...' : 'Start topic practice'}
          </button>
          <Link className="rounded border px-3 py-1.5 text-sm" href="/dashboard">
            Back
          </Link>
        </div>
      </div>
    </section>
  );
}
