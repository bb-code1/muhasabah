'use client';

import Link from 'next/link';

interface DashboardRecoveryStreakCardProps {
  streakDays: number;
  streakText: string;
  latestRelapseDate?: Date | null;
}

export default function DashboardRecoveryStreakCard({
  streakDays,
  streakText,
  latestRelapseDate,
}: DashboardRecoveryStreakCardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h4 className="text-title-sm" style={{ fontWeight: 700, color: 'var(--c-on-surface-variant)', margin: 0 }}>
        Habit Tracker
      </h4>
      <Link
        href="/relapse"
        className="card"
        style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--c-surface-container-high)',
          border: '1px solid var(--c-outline-variant)',
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flexGrow: 1,
          justifyContent: 'center',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc3545', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              RECOVERY STATUS
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--c-on-surface-variant)' }}>
              arrow_forward
            </span>
          </div>
          <h3
            className="text-title-md"
            style={{
              margin: 0,
              fontWeight: 700,
              color: 'var(--c-on-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Streak: {streakDays} {streakDays === 1 ? 'Day' : 'Days'} Clean
          </h3>
          <p
            style={{
              margin: 0,
              lineHeight: 1.5,
              fontSize: '13px',
              color: 'var(--c-on-surface-variant)',
              fontStyle: 'italic',
              fontWeight: 600,
            }}
          >
            {streakText}
          </p>
          {latestRelapseDate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '2px solid rgba(220, 53, 69, 0.3)', paddingLeft: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--c-on-surface-variant)', fontWeight: 600 }}>LAST OCCURRENCE LOGGED</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface)' }}>
                {new Date(latestRelapseDate).toLocaleDateString()} at {new Date(latestRelapseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
