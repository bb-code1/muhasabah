'use client';

import { BookOpen, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Book } from '@prisma/client';

interface Props {
  book: Book;
  onView: (book: Book) => void;
  onEdit: (book: Book, e: React.MouseEvent) => void;
  onDelete: (bookId: number, e: React.MouseEvent) => void;
}

export default function BookCard({ book, onView, onEdit, onDelete }: Props) {
  const dateStr = new Date(book.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="card"
      onClick={() => onView(book)}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '24px', borderRadius: '16px', border: '1.5px solid var(--c-outline-variant)', backgroundColor: 'var(--c-surface-container-low)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--c-primary)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(191,145,41,0.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--c-outline-variant)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ padding: '10px', backgroundColor: 'rgba(191,145,41,0.1)', color: 'var(--c-primary)', borderRadius: '12px', display: 'flex', flexShrink: 0 }}><BookOpen size={20} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 className="text-title-md" style={{ margin: 0, fontWeight: 700, color: 'var(--c-on-surface)', wordBreak: 'break-word', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{book.title}</h4>
          {book.author && <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 600, color: 'var(--c-on-surface-variant)' }}>by {book.author}</p>}
        </div>
      </div>
      {book.notes && (
        <p style={{ margin: 0, padding: '10px 14px', borderRadius: '12px', backgroundColor: 'var(--c-surface-container-high)', fontSize: '13px', color: 'var(--c-on-surface-variant)', lineHeight: 1.5, fontStyle: 'italic', borderLeft: '4px solid var(--c-primary)', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          &quot;{book.notes}&quot;
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '12px', marginTop: 'auto' }}>
        <span className="text-body-sm text-on-surface-variant" style={{ fontWeight: 600 }}>Saved: {dateStr}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {book.driveLink && (
            <a href={book.driveLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="primary-btn"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px', boxShadow: 'none' }}>
              <ExternalLink size={13} /> Link
            </a>
          )}
          <button onClick={(e) => onEdit(book, e)}
            style={{ padding: '6px', backgroundColor: 'transparent', border: '1px solid var(--c-outline-variant)', borderRadius: '8px', color: 'var(--c-on-surface-variant)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--c-surface-container-high)'; e.currentTarget.style.color = 'var(--c-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--c-on-surface-variant)'; }}>
            <Edit size={14} />
          </button>
          <button onClick={(e) => onDelete(book.id, e)}
            style={{ padding: '6px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
