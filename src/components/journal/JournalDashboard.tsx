'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Edit, Trash2, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { addJournalEntry, deleteJournalEntry, editJournalEntry } from '@/actions';
import { useToast } from '@/context/ToastContext';
import { JournalEntry, JournalCategory } from '@prisma/client';

const CATEGORY_LABELS: Record<JournalCategory, string> = {
  OFFICE: 'Office Work',
  LEARNING: 'Career Learnings',
  MISC: 'Miscellaneous',
};

interface Props {
  category: JournalCategory;
  initialEntries: JournalEntry[];
}

function getSubjectColor(subject: string) {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' }, // Blue
    { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' }, // Green
    { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' }, // Purple
    { bg: '#fff7ed', text: '#9a3412', border: '#ffedd5' }, // Orange
    { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' }, // Pink
    { bg: '#ecfeff', text: '#155e75', border: '#c5f2f7' }, // Cyan
    { bg: '#f0fdfa', text: '#115e59', border: '#99f6e4' }  // Teal
  ];
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
}

export default function JournalDashboard({ category, initialEntries }: Props) {
  const { showToast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('ALL');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleAdd = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('category', category);
      if (category === 'LEARNING' && subject.trim()) {
        formData.append('subject', subject.trim());
      }
      await addJournalEntry(formData);
      setContent('');
      setSubject('');
      setIsAddOpen(false);
      setCurrentPage(1);
      showToast('Entry added successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to add entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newPeriod: string) => {
    setFilterPeriod(newPeriod);
    setCurrentPage(1);
  };

  // Filter entries by time period
  const filteredEntries = initialEntries.filter(entry => {
    const d = new Date(entry.date);
    const now = new Date();

    if (filterPeriod === 'ALL') return true;
    if (filterPeriod === 'TODAY') {
      return d.toISOString().split('T')[0] === now.toISOString().split('T')[0];
    }
    if (filterPeriod === 'WEEK') {
      const weekStart = new Date(now);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return d >= weekStart;
    }
    if (filterPeriod === 'MONTH') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (filterPeriod === 'YEAR') {
      return d.getFullYear() === now.getFullYear();
    }
    if (filterPeriod === 'CUSTOM') {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    }
    return true;
  });

  // Pagination
  const PAGE_SIZE = 25;
  const totalPages = Math.ceil(filteredEntries.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedEntries = filteredEntries.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const filterTabs = [
    { id: 'TODAY', label: 'Today' },
    { id: 'WEEK', label: 'This Week' },
    { id: 'MONTH', label: 'This Month' },
    { id: 'YEAR', label: 'This Year' },
    { id: 'ALL', label: 'All Time' },
    { id: 'CUSTOM', label: 'Custom Range' },
  ];

  return (
    <div>
      {/* ADD BUTTON */}
      <button 
        onClick={() => setIsAddOpen(true)}
        className="primary-btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 700 }}
      >
        <Plus size={18} /> Add New Learning
      </button>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '24px',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: filterPeriod === tab.id ? 'var(--c-primary)' : 'var(--c-surface-container-high)',
              color: filterPeriod === tab.id ? 'var(--c-on-primary)' : 'var(--c-on-surface-variant)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Custom Range date inputs */}
      {filterPeriod === 'CUSTOM' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input type="date" value={customStart} onChange={(e) => { setCustomStart(e.target.value); setCurrentPage(1); }} className="search-input" style={{ borderRadius: '10px' }} />
          <span className="text-on-surface-variant" style={{ fontWeight: 600 }}>to</span>
          <input type="date" value={customEnd} onChange={(e) => { setCustomEnd(e.target.value); setCurrentPage(1); }} className="search-input" style={{ borderRadius: '10px' }} />
        </div>
      )}

      {/* ENTRIES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {paginatedEntries.length === 0 ? (
          <p className="text-on-surface-variant text-body-md" style={{ textAlign: 'center', padding: '60px 40px', gridColumn: '1 / -1', fontStyle: 'italic' }}>No entries found for this time period.</p>
        ) : (
          paginatedEntries.map(entry => {
            const colors = entry.subject ? getSubjectColor(entry.subject) : null;
            return (
              <div 
                key={entry.id} 
                className="card" 
                onClick={() => setSelectedEntry(entry)}
                style={{ 
                  padding: '20px', 
                  cursor: 'pointer',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '14px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--c-outline-variant)',
                  backgroundColor: 'var(--c-surface-container-low)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  minWidth: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--c-primary)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(191,145,41,0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--c-outline-variant)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Subject Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  {entry.subject ? (
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      backgroundColor: colors?.bg,
                      color: colors?.text,
                      border: `1.5px solid ${colors?.border}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {entry.subject}
                    </span>
                  ) : (
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      backgroundColor: 'var(--c-surface-container-highest)',
                      color: 'var(--c-on-surface-variant)',
                      border: '1px solid var(--c-outline-variant)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      General
                    </span>
                  )}
                  <GraduationCap size={16} color="var(--c-primary)" style={{ opacity: 0.8 }} />
                </div>

                <p className="text-body-md" style={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: 1.6, 
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                  color: 'var(--c-on-surface)',
                  fontWeight: 500
                }}>{entry.content}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '12px', marginTop: 'auto' }}>
                  <Calendar size={13} color="var(--c-on-surface-variant)" style={{ opacity: 0.7 }} />
                  <span className="text-label-sm text-on-surface-variant" style={{ textTransform: 'none', fontWeight: 600 }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
          <button
            disabled={activePage <= 1}
            onClick={() => setCurrentPage(activePage - 1)}
            className="primary-btn"
            style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: activePage <= 1 ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage <= 1 ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage <= 1 ? 0.5 : 1, cursor: activePage <= 1 ? 'not-allowed' : 'pointer', boxShadow: 'none' }}
          >
            Previous
          </button>
          <span className="text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>
            Page {activePage} of {totalPages}
          </span>
          <button
            disabled={activePage >= totalPages}
            onClick={() => setCurrentPage(activePage + 1)}
            className="primary-btn"
            style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: activePage >= totalPages ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage >= totalPages ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage >= totalPages ? 0.5 : 1, cursor: activePage >= totalPages ? 'not-allowed' : 'pointer', boxShadow: 'none' }}
          >
            Next
          </button>
        </div>
      )}

      {/* ADD ENTRY MODAL */}
      {isAddOpen && mounted && createPortal(
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(6px)' }}
          onClick={() => setIsAddOpen(false)}
        >
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>What did I learn today?</h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
            </div>
            
            {category === 'LEARNING' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Subject / Topic (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, System Design, Communication"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Learnings Description
              </label>
              <textarea
                placeholder="Write about what you learned..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="search-input"
                style={{ width: '100%', borderRadius: '10px', resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px' }}>
              <button type="button" onClick={() => setIsAddOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAdd} className="primary-btn" disabled={loading} style={{ padding: '10px 24px', borderRadius: '8px' }}>{loading ? 'Saving...' : 'Save Entry'}</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ENTRY DETAILS MODAL */}
      {selectedEntry && mounted && createPortal(
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(6px)' }}
          onClick={() => setSelectedEntry(null)}
        >
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedEntry(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--c-on-surface-variant)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entry Details</span>
                {selectedEntry.subject && (
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: '20px', 
                    backgroundColor: getSubjectColor(selectedEntry.subject).bg,
                    color: getSubjectColor(selectedEntry.subject).text,
                    border: `1px solid ${getSubjectColor(selectedEntry.subject).border}`,
                    textTransform: 'uppercase'
                  }}>
                    {selectedEntry.subject}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--c-on-surface)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 500 }}>{selectedEntry.content}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--c-surface-container-low)', border: '1px solid var(--c-outline-variant)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '10px', color: 'var(--c-on-surface-variant)', fontWeight: 600 }}>RECORDED ON</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c-on-surface)' }}>
                  {new Date(selectedEntry.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(selectedEntry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setEditContent(selectedEntry.content);
                  setEditSubject(selectedEntry.subject || '');
                  setIsEditOpen(true);
                }}
                className="primary-btn"
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, boxShadow: 'none' }}
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this entry?')) {
                    await deleteJournalEntry(selectedEntry.id);
                    setSelectedEntry(null);
                    showToast('Entry deleted.', 'success');
                  }
                }}
                className="primary-btn"
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid rgba(220, 53, 69, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, boxShadow: 'none' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedEntry && mounted && createPortal(
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1010, padding: '16px', backdropFilter: 'blur(6px)' }}
          onClick={() => setIsEditOpen(false)}
        >
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>Edit Entry</h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
            </div>

            {category === 'LEARNING' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Subject / Topic (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, System Design, Communication"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Learnings Description
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="search-input"
                style={{ width: '100%', borderRadius: '10px', resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px' }}>
              <button type="button" onClick={() => setIsEditOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={async () => {
                  const subjectValue = category === 'LEARNING' ? editSubject.trim() || null : null;
                  await editJournalEntry(selectedEntry.id, editContent, subjectValue);
                  setIsEditOpen(false);
                  setSelectedEntry(null);
                  showToast('Entry updated!', 'success');
                }}
                className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
