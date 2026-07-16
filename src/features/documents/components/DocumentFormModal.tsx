'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Document, DocumentFolder } from '@prisma/client';
import { addDocument, updateDocument } from '@/features/documents/actions';
import { useToast } from '@/context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingDoc: Document | null;
  activeFolderId: number | null;
  folders: DocumentFolder[];
  onSuccess: () => void;
}

export default function DocumentFormModal({ isOpen, onClose, editingDoc, activeFolderId, folders, onSuccess }: Props) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [formFolderId, setFormFolderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (editingDoc) {
        setTitle(editingDoc.title);
        setLink(editingDoc.link);
        setNotes(editingDoc.notes || '');
        setFormFolderId(editingDoc.folderId ?? null);
      } else {
        setTitle('');
        setLink('');
        setNotes('');
        setFormFolderId(activeFolderId);
      }
    }
  }, [isOpen, editingDoc, activeFolderId]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) return;
    setLoading(true);
    try {
      if (editingDoc) {
        await updateDocument(editingDoc.id, title, link, notes, formFolderId);
        showToast('Document updated successfully!', 'success');
      } else {
        await addDocument(title, link, notes, formFolderId);
        showToast('Document added successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch {
      showToast(editingDoc ? 'Failed to update document' : 'Failed to add document', 'error');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '16px', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', position: 'relative', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)' }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
        <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>{editingDoc ? 'Edit Document' : 'Add New Document'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 700, fontSize: '11px', color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Title</label>
            <input type="text" placeholder="e.g., Quran Notes" value={title} onChange={(e) => setTitle(e.target.value)} className="search-input" style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 700, fontSize: '11px', color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Link</label>
            <input type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} className="search-input" style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 700, fontSize: '11px', color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Folder</label>
            <select value={formFolderId ?? ''} onChange={(e) => setFormFolderId(e.target.value ? Number(e.target.value) : null)} className="search-input" style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}>
              <option value="">— Unfiled —</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 700, fontSize: '11px', color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes / Context</label>
            <textarea placeholder="Your notes or context (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="search-input" style={{ width: '100%', minHeight: '90px', borderRadius: '10px', resize: 'vertical', fontSize: '14px', lineHeight: 1.6 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px' }} disabled={loading}>{loading ? 'Saving…' : editingDoc ? 'Save Changes' : 'Add Document'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
