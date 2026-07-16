'use client';

import { createPortal } from 'react-dom';
import { X, Edit, Trash2 } from 'lucide-react';
import { JournalCategory, JournalEntry } from '@prisma/client';
import { deleteJournalEntry } from '@/actions/index';
import { getSubjectColor, getWorkTypeStyle, getMiscActivityStyle } from './utils';
import { useToast } from '@/context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedEntry: JournalEntry | null;
  category: JournalCategory;
  onEditClick: () => void;
  onDeleteSuccess: () => void;
}

export default function EntryDetailsModal({ isOpen, onClose, selectedEntry, category, onEditClick, onDeleteSuccess }: Props) {
  const { showToast } = useToast();

  if (!isOpen || !selectedEntry) return null;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteJournalEntry(selectedEntry.id);
        showToast('Entry deleted.', 'success');
        onDeleteSuccess();
      } catch (error) {
        console.error(error);
        showToast('Failed to delete entry.', 'error');
      }
    }
  };

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--c-on-surface-variant)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entry Details</span>
            {category === 'LEARNING' && selectedEntry.subject && (
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
            {category === 'OFFICE' && selectedEntry.workType && (
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '20px', 
                backgroundColor: getWorkTypeStyle(selectedEntry.workType).bg,
                color: getWorkTypeStyle(selectedEntry.workType).text,
                border: `1px solid ${getWorkTypeStyle(selectedEntry.workType).border}`,
                textTransform: 'uppercase'
              }}>
                {selectedEntry.workType}
              </span>
            )}
            {category === 'MISC' && selectedEntry.activity && (
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '20px', 
                backgroundColor: getMiscActivityStyle(selectedEntry.activity).bg,
                color: getMiscActivityStyle(selectedEntry.activity).text,
                border: `1px solid ${getMiscActivityStyle(selectedEntry.activity).border}`,
                textTransform: 'uppercase'
              }}>
                {selectedEntry.activity}
              </span>
            )}
          </div>

          {category === 'OFFICE' && selectedEntry.project && (
            <h4 style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 800, color: 'var(--c-primary)' }}>
              💼 Project: {selectedEntry.project}
            </h4>
          )}

          {category === 'MISC' && selectedEntry.location && (
            <h4 style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 800, color: 'var(--c-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📍 Place: {selectedEntry.location}
            </h4>
          )}

          {category === 'OFFICE' && (selectedEntry.ticketId || selectedEntry.duration) && (
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface-variant)', backgroundColor: 'var(--c-surface-container-low)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--c-outline-variant)' }}>
              {selectedEntry.ticketId && <span>🎫 Ticket: {selectedEntry.ticketId}</span>}
              {selectedEntry.duration && <span>⏱️ Duration: {selectedEntry.duration}</span>}
            </div>
          )}

          {category === 'MISC' && selectedEntry.tag && (
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 700, color: 'var(--c-primary)', backgroundColor: 'rgba(191,145,41,0.06)', padding: '8px 12px', borderRadius: '8px', border: '1px dashed rgba(191,145,41,0.2)', width: 'fit-content' }}>
              <span>🏷️ Tag: {selectedEntry.tag}</span>
            </div>
          )}

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
            onClick={onEditClick}
            className="primary-btn"
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, boxShadow: 'none' }}
          >
            <Edit size={16} /> Edit
          </button>
          <button
            onClick={handleDelete}
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
