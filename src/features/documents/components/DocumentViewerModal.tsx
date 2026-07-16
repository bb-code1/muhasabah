'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, ExternalLink, Edit, Trash2, Folder } from 'lucide-react';
import { Document, DocumentFolder } from '@prisma/client';

interface Props {
  viewingDoc: Document | null;
  folders: DocumentFolder[];
  onClose: () => void;
  onEdit: (doc: Document) => void;
  onDelete: (docId: number) => void;
}

export default function DocumentViewerModal({ viewingDoc, folders, onClose, onEdit, onDelete }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!viewingDoc || !mounted) return null;

  return createPortal(
    <div role="presentation" onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(6px)' }}>
      <div role="dialog" aria-modal="true" aria-labelledby="doc-viewer-title" onClick={(e) => e.stopPropagation()} className="card"
        style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '16px', padding: '28px', position: 'relative', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)' }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
        <div style={{ paddingRight: '32px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ padding: '10px', backgroundColor: 'rgba(191,145,41,0.1)', color: 'var(--c-primary)', borderRadius: '12px', display: 'flex', flexShrink: 0 }}><FileText size={22} /></div>
          <div>
            <h3 id="doc-viewer-title" className="text-headline-sm" style={{ margin: 0, fontWeight: 700, wordBreak: 'break-word', lineHeight: 1.3 }}>{viewingDoc.title}</h3>
            {viewingDoc.folderId && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--c-primary)', fontWeight: 600, marginTop: '4px' }}>
                <Folder size={12} /> {folders.find(f => f.id === viewingDoc.folderId)?.name}
              </span>
            )}
            <span className="text-label-sm text-on-surface-variant" style={{ display: 'block', marginTop: '6px' }}>
              Saved: {new Date(viewingDoc.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--c-outline-variant)' }} />
        {viewingDoc.notes ? (
          <div style={{ overflowY: 'auto' }}>
            <p className="text-label-md" style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '11px', color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes / Context</p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.65, wordBreak: 'break-word', color: 'var(--c-on-surface)' }}>{viewingDoc.notes}</p>
          </div>
        ) : (
          <p className="text-body-md text-on-surface-variant" style={{ margin: 0, fontStyle: 'italic' }}>No notes added for this document.</p>
        )}
        <div style={{ borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => onEdit(viewingDoc)}
              style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid var(--c-outline-variant)', borderRadius: '8px', color: 'var(--c-on-surface-variant)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c-surface-container-high)'; e.currentTarget.style.color = 'var(--c-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--c-on-surface-variant)'; }}
              title="Edit document"><Edit size={16} /></button>
            <button type="button" onClick={() => onDelete(viewingDoc.id)}
              style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Delete document"><Trash2 size={16} /></button>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            {viewingDoc.link && (
              <a href={viewingDoc.link} target="_blank" rel="noopener noreferrer" className="primary-btn"
                style={{ padding: '10px 20px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <ExternalLink size={15} /> Open Document
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
