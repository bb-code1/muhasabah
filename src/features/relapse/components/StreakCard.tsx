import { Flame } from 'lucide-react';

export default function StreakCard({ streakInfo }: { streakInfo: { days: number; text: string } }) {
  return (
    <div className="card highlight-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '3px solid var(--c-primary)', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(195,150,38,0.12)', color: 'var(--c-primary)' }}>
          <Flame size={22} />
        </span>
        <div>
          <span className="text-label-sm text-on-surface-variant">CURRENT RECOVERY STREAK</span>
          <h2 className="text-headline-lg" style={{ margin: 0, fontWeight: 800, color: 'var(--c-primary)' }}>
            {streakInfo.days} {streakInfo.days === 1 ? 'Day' : 'Days'}
          </h2>
        </div>
      </div>
      <p className="text-body-md text-on-surface-variant" style={{ margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
        {streakInfo.text}
      </p>
    </div>
  );
}
