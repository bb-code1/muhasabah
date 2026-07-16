'use client';

import { createPortal } from 'react-dom';
import { X, Users } from 'lucide-react';

interface StatsDetailItem {
  date: Date;
  isCompleted?: boolean;
  prayedWithJamaat?: boolean;
  text?: string;
}

interface StatsDetailsModalProps {
  activeStatsDetail: { type: 'prayer' | 'quran' | 'deeds'; title: string; prayerName?: string } | null;
  onClose: () => void;
  getPrayerPeriodDetails: (prayer: string) => StatsDetailItem[];
  getQuranPeriodDetails: () => StatsDetailItem[];
  additionalStats: {
    quranDays: number;
    totalVerses: number;
    surahs: string[];
    activities: { date: Date; text: string }[];
  };
}

export default function StatsDetailsModal({
  activeStatsDetail,
  onClose,
  getPrayerPeriodDetails,
  getQuranPeriodDetails,
  additionalStats
}: StatsDetailsModalProps) {
  if (!activeStatsDetail) return null;

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '560px', maxHeight: '80vh', overflowY: 'auto', padding: '28px', position: 'relative', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '20px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}
        >
          <X size={20} />
        </button>

        <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>{activeStatsDetail.title}</h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto',
          maxHeight: '60vh',
          paddingRight: '6px'
        }}>
          
          {/* Prayer details */}
          {activeStatsDetail.type === 'prayer' && activeStatsDetail.prayerName && (
            <>
              {getPrayerPeriodDetails(activeStatsDetail.prayerName).length > 0 ? (
                getPrayerPeriodDetails(activeStatsDetail.prayerName).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--c-surface-container-low)',
                      border: '1px solid var(--c-outline-variant)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--c-on-surface)', fontSize: '14px' }}>
                        {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      {!['Tahajjud', 'Azkaar'].includes(activeStatsDetail.prayerName!) && item.isCompleted && (
                        <span style={{ fontSize: '11px', color: item.prayedWithJamaat ? 'var(--c-secondary)' : 'var(--c-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <Users size={12} /> {item.prayedWithJamaat ? 'Prayed in Congregation' : 'Prayed Individually'}
                        </span>
                      )}
                    </div>
                    
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: item.isCompleted ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                      color: item.isCompleted ? '#28a745' : '#dc3545',
                    }}>
                      {item.isCompleted ? 'Completed' : 'Missed'}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--c-on-surface-variant)', fontStyle: 'italic', margin: '20px 0', textAlign: 'center' }}>
                  No tracking records found for this prayer in the selected period.
                </p>
              )}
            </>
          )}

          {/* Quran details */}
          {activeStatsDetail.type === 'quran' && (
            <>
              {getQuranPeriodDetails().length > 0 ? (
                getQuranPeriodDetails().map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--c-surface-container-low)',
                      border: '1px solid var(--c-outline-variant)'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--c-on-surface-variant)', fontWeight: 600 }}>
                      {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--c-on-surface)', fontSize: '14px' }}>
                      {item.text}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--c-on-surface-variant)', fontStyle: 'italic', margin: '20px 0', textAlign: 'center' }}>
                  No Quran memorisation recorded in the selected period.
                </p>
              )}
            </>
          )}

          {/* Good Deeds details */}
          {activeStatsDetail.type === 'deeds' && (
            <>
              {additionalStats.activities.length > 0 ? (
                additionalStats.activities.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--c-surface-container-low)',
                      border: '1px solid var(--c-outline-variant)'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--c-on-surface-variant)', fontWeight: 600 }}>
                      {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-on-surface)', whiteSpace: 'pre-wrap', fontWeight: 500, lineHeight: 1.5 }}>
                      {item.text}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--c-on-surface-variant)', fontStyle: 'italic', margin: '20px 0', textAlign: 'center' }}>
                  No other activities logged in the selected period.
                </p>
              )}
            </>
          )}

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', marginTop: '8px' }}>
          <button
            onClick={onClose}
            className="primary-btn"
            style={{ backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none', padding: '8px 24px', borderRadius: '8px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
