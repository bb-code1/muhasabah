'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, ExternalLink, Edit, Trash2, Folder } from 'lucide-react';
import { Book, BookFolder } from '@prisma/client';

interface Props {
  viewingBook: Book | null;
  folders: BookFolder[];
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (bookId: number) => void;
}

export default function BookViewerModal({ viewingBook, folders, onClose, onEdit, onDelete }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!viewingBook || !mounted) return null;

  return createPortal(
    <div role="presentation" onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(6px)' }}>
      <div role="dialog" aria-modal="true" aria-labelledby="book-viewer-title" onClick={(e) => e.stopPropagation()} className="card"
        style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '16px', padding: '28px', position: 'relative', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)' }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
        <div style={{ paddingRight: '32px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ padding: '10px', backgroundColor: 'rgba(191,145,41,0.1)', color: 'var(--c-primary)', borderRadius: '12px', display: 'flex', flexShrink: 0 }}><BookOpen size={22} /></div>
          <div>
            <h3 id="book-viewer-title" className="text-headline-sm" style={{ margin: 0, fontWeight: 700, wordBreak: 'break-word', lineHeight: 1.3 }}>{viewingBook.title}</h3>
            {viewingBook.author && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 600, color: 'var(--c-on-surface-variant)' }}>by {viewingBook.author}</p>}
            {viewingBook.folderId && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--c-primary)', fontWeight: 600, marginTop: '4px' }}>
                <Folder size={12} /> {folders.find(f => f.id === viewingBook.folderId)?.name}
              </span>
            )}
            <span className="text-label-sm text-on-surface-variant" style={{ display: 'block', marginTop: '6px' }}>
              Saved: {new Date(viewingBook.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--c-outline-variant)' }} />
        {viewingBook.notes ? (
          <div style={{ overflowY: 'auto' }}>
            <p className="text-label-md" style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '11px', color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes &amp; Reflections</p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.65, wordBreak: 'break-word', color: 'var(--c-on-surface)' }}>{viewingBook.notes}</p>
          </div>
        ) : (
          <p className="text-body-md text-on-surface-variant" style={{ margin: 0, fontStyle: 'italic' }}>No notes added for this book.</p>
        )}
        <div style={{ borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => onEdit(viewingBook)}
              style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid var(--c-outline-variant)', borderRadius: '8px', color: 'var(--c-on-surface-variant)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c-surface-container-high)'; e.currentTarget.style.color = 'var(--c-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--c-on-surface-variant)'; }}
              title="Edit book"><Edit size={16} /></button>
            <button type="button" onClick={() => onDelete(viewingBook.id)}
              style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Delete book"><Trash2 size={16} /></button>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            {viewingBook.driveLink && (
              <a href={viewingBook.driveLink} target="_blank" rel="noopener noreferrer" className="primary-btn"
                style={{ padding: '10px 20px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <ExternalLink size={15} /> Open Book
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
