'use client';

import { useState } from 'react';
import { FocusSession } from '@prisma/client';
import { Calendar, Trash2, Clock, Trophy, Flame, Sparkles } from 'lucide-react';
import { deleteFocusSession } from '@/features/tools/actions';
import { useToast } from '@/context/ToastContext';
import CustomDateRangeDialog from '@/components/ui/CustomDateRangeDialog';

interface FocusHistoryTableProps {
  initialSessions: FocusSession[];
}

export default function FocusHistoryTable({ initialSessions }: FocusHistoryTableProps) {
  const [sessions, setSessions] = useState<FocusSession[]>(initialSessions);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year' | 'custom'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [startDateStr, setStartDateStr] = useState<string>('');
  const [endDateStr, setEndDateStr] = useState<string>('');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { showToast } = useToast();
  const PAGE_SIZE = 10;

  // Sync if props update
  if (initialSessions !== sessions && initialSessions.length !== sessions.length) {
    setSessions(initialSessions);
  }

  // Available Years
  const availableYears = Array.from(
    new Set([
      new Date().getFullYear(),
      ...sessions.map((s) => new Date(s.completedAt).getFullYear()),
    ])
  ).sort((a, b) => b - a);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this focus session record?')) return;
    setDeletingId(id);
    try {
      await deleteFocusSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showToast('Focus session deleted.', 'info');
    } catch (e) {
      showToast(`Error deleting session: ${(e as Error).message}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.completedAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedYear !== 'all') {
      if (sessionDate.getFullYear().toString() !== selectedYear) {
        return false;
      }
    }

    switch (activeFilter) {
      case 'today': {
        const startOfToday = new Date(today);
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);
        return sessionDate >= startOfToday && sessionDate <= endOfToday;
      }
      case 'week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
      }
      case 'month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        return sessionDate >= startOfMonth && sessionDate <= endOfMonth;
      }
      case 'year': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        return sessionDate >= startOfYear && sessionDate <= endOfYear;
      }
      case 'custom': {
        if (!startDateStr && !endDateStr) return true;
        const start = startDateStr ? new Date(startDateStr) : new Date(0);
        const end = endDateStr ? new Date(endDateStr) : new Date(8640000000000000);
        end.setHours(23, 59, 59, 999);
        return sessionDate >= start && sessionDate <= end;
      }
      case 'all':
      default:
        return true;
    }
  });

  // Calculate Statistics for filtered data
  const totalMinutes = filteredSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const sessionCount = filteredSessions.length;
  const avgDuration = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;

  // Today's specific minutes
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayMinutes = sessions
    .filter((s) => {
      const d = new Date(s.completedAt);
      return d >= todayStart && d <= todayEnd;
    })
    .reduce((acc, curr) => acc + curr.duration, 0);

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / PAGE_SIZE);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: 'var(--c-primary)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant">TOTAL FOCUS TIME</span>
            <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 800 }}>{totalHours} hrs</h3>
            <span className="text-body-xs text-on-surface-variant">({totalMinutes} mins total)</span>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#16a34a' }}>
            <Flame size={24} />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant">TODAY FOCUS</span>
            <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 800, color: '#16a34a' }}>{todayMinutes} mins</h3>
            <span className="text-body-xs text-on-surface-variant">Logged today</span>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' }}>
            <Trophy size={24} />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant">SESSIONS COMPLETED</span>
            <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 800 }}>{sessionCount}</h3>
            <span className="text-body-xs text-on-surface-variant">In current filter</span>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#9333ea' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant">AVG DURATION</span>
            <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 800 }}>{avgDuration} mins</h3>
            <span className="text-body-xs text-on-surface-variant">Per focus session</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card flex-col gap-16" style={{ padding: '20px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--c-primary)' }} />
            <h3 className="text-title-md" style={{ margin: 0, fontWeight: 700 }}>Focus History & Filter</h3>
          </div>

          {/* Year Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', letterSpacing: '0.05em' }}>YEAR:</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--c-outline-variant)',
                backgroundColor: 'var(--c-surface)',
                color: 'var(--c-on-surface)'
              }}
            >
              <option value="all">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr.toString()}>{yr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'This Year' },
            { id: 'custom', label: activeFilter === 'custom' && startDateStr ? `Custom (${startDateStr} to ${endDateStr || 'Now'})` : 'Custom Range' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'custom') {
                  setIsCustomRangeOpen(true);
                } else {
                  setActiveFilter(tab.id as typeof activeFilter);
                  setCurrentPage(1);
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '13px',
                backgroundColor: activeFilter === tab.id ? 'var(--c-primary)' : 'var(--c-surface-container-high)',
                color: activeFilter === tab.id ? '#ffffff' : 'var(--c-on-surface)',
                border: '1px solid var(--c-outline-variant)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="card" style={{ padding: '0', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--c-surface-container-low)', borderBottom: '1px solid var(--c-outline-variant)' }}>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>Date & Time</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>Focus Task / Label</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>Duration</th>
                <th style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.length > 0 ? (
                paginatedSessions.map((session) => (
                  <tr key={session.id} style={{ borderBottom: '1px solid var(--c-outline-variant)', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--c-on-surface)' }}>
                      {formatDate(session.completedAt)}
                    </td>
                    <td style={{ padding: '14px 20px', color: session.label ? 'var(--c-on-surface)' : 'var(--c-on-surface-variant)', fontStyle: session.label ? 'normal' : 'italic' }}>
                      {session.label || 'General Focus Session'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        color: 'var(--c-primary)',
                        fontWeight: 700,
                        fontSize: '13px'
                      }}>
                        ⏱️ {session.duration} mins
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(session.id)}
                        disabled={deletingId === session.id}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--c-error)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '8px',
                          opacity: deletingId === session.id ? 0.5 : 1
                        }}
                        title="Delete session record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--c-on-surface-variant)' }}>
                    <Clock size={32} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No focus sessions recorded for this filter range.</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Start the Pomodoro timer above to log your first session!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--c-outline-variant)' }}>
            <span style={{ fontSize: '13px', color: 'var(--c-on-surface-variant)' }}>
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredSessions.length)} of {filteredSessions.length} sessions
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px' }}
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '8px' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Range Dialog */}
      {isCustomRangeOpen && (
        <CustomDateRangeDialog
          initialStartDate={startDateStr}
          initialEndDate={endDateStr}
          onClose={() => setIsCustomRangeOpen(false)}
          onApply={(start, end) => {
            setStartDateStr(start);
            setEndDateStr(end);
            setActiveFilter('custom');
            setCurrentPage(1);
            setIsCustomRangeOpen(false);
          }}
        />
      )}
    </div>
  );
}
