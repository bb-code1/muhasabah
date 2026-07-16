import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { RelapseLog } from '@prisma/client';

interface EditLogModalProps {
  isOpen: boolean;
  selectedLog: RelapseLog | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  logDate: string;
  setLogDate: (date: string) => void;
  logTime: string;
  setLogTime: (time: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  loading: boolean;
  mounted: boolean;
}

export default function EditLogModal({
  isOpen,
  selectedLog,
  onClose,
  onSubmit,
  logDate,
  setLogDate,
  logTime,
  setLogTime,
  notes,
  setNotes,
  loading,
  mounted,
}: EditLogModalProps) {
  if (!isOpen || !selectedLog || !mounted) return null;

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1010, padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-lg)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>Edit Log Entry</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
        </div>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="text-label-md" style={{ fontWeight: 600 }}>Date</label>
              <input 
                type="date" 
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="search-input"
                style={{ width: '100%', borderRadius: '8px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="text-label-md" style={{ fontWeight: 600 }}>Time</label>
              <input 
                type="time" 
                value={logTime}
                onChange={(e) => setLogTime(e.target.value)}
                className="search-input"
                style={{ width: '100%', borderRadius: '8px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 600 }}>Notes / Triggers / Reflections (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="search-input"
              style={{ width: '100%', minHeight: '100px', borderRadius: '8px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={loading} style={{ padding: '10px 24px', borderRadius: '8px' }}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
