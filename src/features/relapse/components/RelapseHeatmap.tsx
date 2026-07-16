import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { RelapseLog } from '@prisma/client';
import { getCalendarGrid, getYearOptions } from './utils';

export default function RelapseHeatmap({ initialLogs }: { initialLogs: RelapseLog[] }) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hoveredDay, setHoveredDay] = useState<{
    date: Date;
    count: number;
    logs: RelapseLog[];
    x: number;
    y: number;
  } | null>(null);

  const yearOptions = getYearOptions(initialLogs);

  const logsByDate = initialLogs.reduce<Record<string, RelapseLog[]>>((acc, log) => {
    const d = new Date(log.date);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(log);
    return acc;
  }, {});

  const grid = getCalendarGrid(selectedYear);

  const monthLabels: { label: string; index: number }[] = [];
  let lastMonth = -1;
  grid.forEach((week, weekIdx) => {
    const firstDay = week.find(d => d !== null);
    if (firstDay) {
      const m = firstDay.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({
          label: firstDay.toLocaleDateString(undefined, { month: 'short' }),
          index: weekIdx
        });
        lastMonth = m;
      }
    }
  });

  return (
    <div className="card" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 className="text-title-md" style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)' }}>
            <Calendar size={18} />
            Relapse Heatmap
          </h3>
          <p className="text-body-md text-on-surface-variant" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Track recovery consistency and identify relapse patterns throughout the year.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="search-input"
            style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: 600, fontSize: '13px', minWidth: '90px', backgroundColor: 'var(--c-surface-container-high)', border: '1px solid var(--c-outline-variant)' }}
          >
            {yearOptions.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflowX: 'auto', padding: '10px 0' }}>
        <div style={{ display: 'flex', gap: '3px', marginBottom: '6px', paddingLeft: '32px', position: 'relative', height: '16px', minWidth: `${32 + grid.length * 13}px` }}>
          {monthLabels.map((ml, idx) => {
            const leftPos = 32 + ml.index * 13;
            return (
              <span 
                key={idx} 
                style={{ 
                  position: 'absolute', 
                  left: `${leftPos}px`, 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  color: 'var(--c-on-surface-variant)', 
                  opacity: 0.8 
                }}
              >
                {ml.label}
              </span>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', minWidth: `${32 + grid.length * 13}px` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '9px', fontWeight: 700, color: 'var(--c-on-surface-variant)', width: '24px', textAlign: 'right', paddingRight: '4px', paddingTop: '1px' }}>
            <span style={{ height: '10px', lineHeight: '10px' }}>Sun</span>
            <span style={{ height: '10px', lineHeight: '10px', visibility: 'hidden' }}>Mon</span>
            <span style={{ height: '10px', lineHeight: '10px' }}>Tue</span>
            <span style={{ height: '10px', lineHeight: '10px', visibility: 'hidden' }}>Wed</span>
            <span style={{ height: '10px', lineHeight: '10px' }}>Thu</span>
            <span style={{ height: '10px', lineHeight: '10px', visibility: 'hidden' }}>Fri</span>
            <span style={{ height: '10px', lineHeight: '10px' }}>Sat</span>
          </div>
          
          <div style={{ display: 'flex', gap: '3px' }}>
            {grid.map((week, weekIdx) => (
              <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px', flexShrink: 0 }}>
                {week.map((day, dayIdx) => {
                  if (!day) {
                    return (
                      <div 
                        key={dayIdx} 
                        style={{ 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: 'transparent' 
                        }} 
                      />
                    );
                  }
                  
                  const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                  const dayLogs = logsByDate[dateStr] || [];
                  const count = dayLogs.length;
                  
                  let bgColor = 'var(--c-surface-container-high)';
                  if (count === 1) bgColor = '#fecaca';
                  else if (count === 2) bgColor = '#f87171';
                  else if (count === 3) bgColor = '#ef4444';
                  else if (count >= 4) bgColor = '#991b1b';
                  
                  return (
                    <div
                      key={dayIdx}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const containerRect = e.currentTarget.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
                        if (containerRect) {
                          setHoveredDay({
                            date: day,
                            count,
                            logs: dayLogs,
                            x: rect.left - containerRect.left + rect.width / 2,
                            y: rect.top - containerRect.top - 8
                          });
                        }
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: bgColor,
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {hoveredDay && (
          <div
            style={{
              position: 'absolute',
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y}px`,
              transform: 'translate(-50%, -100%)',
              backgroundColor: 'var(--c-surface-container-highest)',
              border: '1px solid var(--c-outline-variant)',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 9999,
              minWidth: '220px',
              maxWidth: '300px',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              animation: 'slideUpFade 0.2s ease-out forwards'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface)' }}>
                {hoveredDay.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: hoveredDay.count > 0 ? '#dc3545' : 'var(--c-primary)' }}>
                {hoveredDay.count} {hoveredDay.count === 1 ? 'relapse' : 'relapses'}
              </span>
            </div>
            
            {hoveredDay.logs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                {hoveredDay.logs.map((log) => {
                  const timeStr = new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={log.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#dc3545', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {timeStr}
                      </span>
                      {log.notes && (
                        <span style={{ fontSize: '10.5px', color: 'var(--c-on-surface-variant)', fontStyle: 'italic', display: 'block', wordBreak: 'break-word', lineHeight: 1.4 }}>
                          &ldquo;{log.notes}&rdquo;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--c-on-surface-variant)' }}>
        <span>Less</span>
        <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--c-surface-container-high)' }} title="0 relapses" />
        <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#fecaca' }} title="1 relapse" />
        <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#f87171' }} title="2 relapses" />
        <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#ef4444' }} title="3 relapses" />
        <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#991b1b' }} title="4+ relapses" />
        <span>More</span>
      </div>
    </div>
  );
}
