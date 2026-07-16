import { AlertTriangle, Clock } from 'lucide-react';
import { RelapseLog } from '@prisma/client';

interface LogListProps {
  paginatedLogs: RelapseLog[];
  setSelectedLog: (log: RelapseLog) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function LogList({
  paginatedLogs,
  setSelectedLog,
  currentPage,
  totalPages,
  setCurrentPage,
}: LogListProps) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {paginatedLogs.length === 0 ? (
          <p className="text-on-surface-variant text-body-md" style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>No logged occurrences found for this period. Stay strong, keep moving forward!</p>
        ) : (
          paginatedLogs.map((log) => {
            const dateObj = new Date(log.date);
            const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div 
                key={log.id} 
                className="card"
                onClick={() => setSelectedLog(log)}
                style={{ 
                  padding: '16px', 
                  cursor: 'pointer',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--c-outline-variant)',
                  justifyContent: 'space-between',
                  minHeight: '120px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span 
                      style={{ 
                        fontSize: '9px', 
                        fontWeight: 800, 
                        backgroundColor: 'rgba(220, 53, 69, 0.12)', 
                        color: '#dc3545', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <AlertTriangle size={10} /> Logged
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="text-body-md" style={{ fontWeight: 700, color: 'var(--c-on-surface)' }}>
                      {dateStr}
                    </span>
                    <span className="text-label-sm text-on-surface-variant" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {timeStr}
                    </span>
                  </div>

                  {log.notes && (
                    <p 
                      className="text-body-md"
                      style={{ 
                        whiteSpace: 'pre-wrap', 
                        margin: '4px 0 0 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                        color: 'var(--c-on-surface-variant)'
                      }}
                    >
                      {log.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="primary-btn"
            style={{ padding: '8px 16px', backgroundColor: currentPage <= 1 ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: currentPage <= 1 ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', boxShadow: 'none' }}
          >
            Previous
          </button>
          <span className="text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="primary-btn"
            style={{ padding: '8px 16px', backgroundColor: currentPage >= totalPages ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: currentPage >= totalPages ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', boxShadow: 'none' }}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
