import { Flame, ShieldCheck, Plus } from 'lucide-react';
import { RelapseLog } from '@prisma/client';
import { calculateStreak } from './utils';

interface StreakAndActionBlockProps {
  initialLogs: RelapseLog[];
  onOpenAddModal: () => void;
}

export default function StreakAndActionBlock({ initialLogs, onOpenAddModal }: StreakAndActionBlockProps) {
  const streakInfo = calculateStreak(initialLogs);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      
      {/* Streak card */}
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

      {/* Action card */}
      <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px dashed var(--c-outline)', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <ShieldCheck size={40} color="var(--c-primary)" />
        <div>
          <h4 className="text-title-md" style={{ margin: '0 0 4px 0', fontWeight: 700 }}>Stay Mindful</h4>
          <p className="text-label-md text-on-surface-variant" style={{ margin: 0 }}>Every minute is a victory. Log immediately to maintain accountability.</p>
        </div>
        <button onClick={onOpenAddModal} className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Log Occurrence
        </button>
      </div>

    </div>
  );
}
