import React from 'react';
import { createPortal } from 'react-dom';
import { X, Edit, Trash2 } from 'lucide-react';
import { RelapseLog } from '@prisma/client';

interface ViewLogModalProps {
  selectedLog: RelapseLog | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
  mounted: boolean;
}

export default function ViewLogModal({
  selectedLog,
  onClose,
  onEdit,
  onDelete,
  mounted,
}: ViewLogModalProps) {
  if (!selectedLog || !mounted) return null;

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-lg)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              style={{ 
                alignSelf: 'flex-start',
                fontSize: '10px', 
                fontWeight: 700, 
                backgroundColor: 'rgba(220, 53, 69, 0.12)', 
                color: '#dc3545', 
                padding: '2px 8px', 
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Occurrence Details
            </span>
            <h3 className="text-headline-sm" style={{ margin: '4px 0 0 0', fontWeight: 700 }}>
              {new Date(selectedLog.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c-on-surface-variant)' }}>
              at {new Date(selectedLog.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
        </div>

        {selectedLog.notes && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--c-on-surface-variant)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Triggers & Reflections</span>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--c-surface-container-low)', border: '1px solid var(--c-outline-variant)' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-on-surface)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {selectedLog.notes}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '20px', marginTop: '10px' }}>
          <button
            onClick={onEdit}
            className="primary-btn"
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, boxShadow: 'none' }}
          >
            <Edit size={16} /> Edit
          </button>
          <button
            onClick={() => onDelete(selectedLog.id)}
            className="primary-btn"
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid rgba(220, 53, 69, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, boxShadow: 'none' }}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
