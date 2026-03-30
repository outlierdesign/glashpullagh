import type { Metadata } from 'next';
import { PeatlandGame } from '@/components/game/PeatlandGame';

export const metadata: Metadata = {
  title: 'Peatland Dam Game — Glashpullagh',
  description:
    'An interactive game about peatland bog restoration. Place timber dams, peat dams, and sphagnum plugs to retain water and restore the landscape.',
};

export default function GamePage() {
  return (
    <main
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--bg-deep)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: 'var(--bg-dark)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <a
          href="/"
          className="text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}
        >
          &larr; Back to Site
        </a>
        <h1
          className="text-sm tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--cream)',
          }}
        >
          Peatland Water Retention
        </h1>
        <div className="w-16" />
      </div>
      <div className="flex-1 relative overflow-hidden">
        <PeatlandGame />
      </div>
    </main>
  );
}
