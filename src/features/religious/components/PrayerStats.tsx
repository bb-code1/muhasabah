'use client';

import { Calendar } from 'lucide-react';
import CustomDateRangeDialog from '@/components/ui/CustomDateRangeDialog';

interface PrayerStatsProps {
  statsFilter: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';
  setStatsFilter: (filter: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom') => void;
  statsCustomStart: string;
  setStatsCustomStart: (start: string) => void;
  statsCustomEnd: string;
  setStatsCustomEnd: (end: string) => void;
  isStatsCustomRangeOpen: boolean;
  setIsStatsCustomRangeOpen: (isOpen: boolean) => void;
  monthlyStats: Record<string, { completed: number; jamaat: number; total: number }>;
  setActiveStatsDetail: (detail: { type: 'prayer' | 'quran' | 'deeds'; title: string; prayerName?: string }) => void;
}

export default function PrayerStats({
  statsFilter,
  setStatsFilter,
  statsCustomStart,
  setStatsCustomStart,
  statsCustomEnd,
  setStatsCustomEnd,
  isStatsCustomRangeOpen,
  setIsStatsCustomRangeOpen,
  monthlyStats,
  setActiveStatsDetail,
}: PrayerStatsProps) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Calendar color="var(--c-primary)" size={24} />
        <h2 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>
          {statsFilter === 'day' && 'Prayer Stats (Today)'}
          {statsFilter === 'week' && 'Prayer Stats (This Week)'}
          {statsFilter === 'month' && `Prayer Stats (${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})`}
          {statsFilter === 'year' && `Prayer Stats (Year ${new Date().getFullYear()})`}
          {statsFilter === 'all' && 'Prayer Stats (All Time)'}
          {statsFilter === 'custom' && (statsCustomStart && statsCustomEnd ? `Prayer Stats (${statsCustomStart} to ${statsCustomEnd})` : 'Prayer Stats (Custom Range)')}
        </h2>
      </div>

      {/* Statistics filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'day', label: 'Today' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' },
          { id: 'year', label: 'This Year' },
          { id: 'all', label: 'All Time' },
          { id: 'custom', label: 'Custom Range' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'custom') {
                setIsStatsCustomRangeOpen(true);
                return;
              }
              setStatsFilter(tab.id as typeof statsFilter);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: statsFilter === tab.id ? 'var(--c-primary)' : 'var(--c-surface-container-high)',
              color: statsFilter === tab.id ? 'var(--c-on-primary)' : 'var(--c-on-surface-variant)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isStatsCustomRangeOpen && (
        <CustomDateRangeDialog
          initialStartDate={statsCustomStart}
          initialEndDate={statsCustomEnd}
          onClose={() => setIsStatsCustomRangeOpen(false)}
          onApply={(startDate, endDate) => {
            setStatsCustomStart(startDate);
            setStatsCustomEnd(endDate);
            setStatsFilter('custom');
            setIsStatsCustomRangeOpen(false);
          }}
        />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {['Fajr', 'Zuhur', 'Asr', 'Maghrib', 'Isha', 'Tahajjud'].map(prayer => {
          const data = monthlyStats[prayer] || { completed: 0, jamaat: 0, total: 0 };
          const rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
          const isTahajjud = prayer === 'Tahajjud';

          return (
            <div
              key={prayer}
              onClick={() => setActiveStatsDetail({ type: 'prayer', title: `${prayer} Completion Details`, prayerName: prayer })}
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'var(--c-surface-container-low)',
                border: '1px solid var(--c-outline-variant)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--c-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--c-outline-variant)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--c-on-surface)' }}>{prayer}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: rate === 100 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(195, 150, 38, 0.1)',
                  color: rate === 100 ? '#28a745' : 'var(--c-primary)',
                }}>
                  {rate}%
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--c-on-surface-variant)', fontWeight: 500 }}>Completed</span>
                  <span style={{ fontWeight: 600, color: 'var(--c-on-surface)' }}>{data.completed} / {data.total} days</span>
                </div>
                
                {!isTahajjud && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--c-on-surface-variant)', fontWeight: 500 }}>In Jamaat</span>
                    <span style={{ fontWeight: 600, color: 'var(--c-secondary)' }}>{data.jamaat} times</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--c-surface-container-highest)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${rate}%`,
                    height: '100%',
                    backgroundColor: rate === 100 ? 'var(--c-secondary)' : 'var(--c-primary)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
