'use client';

import { useState } from 'react';
import { Plus, Search, FolderOpen, ChevronRight, FolderPlus } from 'lucide-react';
import { deleteDocument, deleteDocumentFolder } from '@/features/documents/actions';
import { useToast } from '@/context/ToastContext';
import { Document, DocumentFolder } from '@prisma/client';

import DocumentFolderModal from './DocumentFolderModal';
import DocumentFormModal from './DocumentFormModal';
import DocumentViewerModal from './DocumentViewerModal';
import DocumentCard from './DocumentCard';
import DocumentFolderCard from './DocumentFolderCard';

interface Props {
  initialDocuments: Document[];
  initialFolders: DocumentFolder[];
}

export default function DocumentsDashboard({ initialDocuments, initialFolders }: Props) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Folder navigation
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  // Folder management modals
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(null);

  // Document modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  // ── Folder handlers ────────────────────────────────────────────────────────

  const openAddFolder = () => { setEditingFolder(null); setIsFolderFormOpen(true); };
  const openRenameFolder = (f: DocumentFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(f);
    setIsFolderFormOpen(true);
  };

  const handleDeleteFolder = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this folder? Documents inside will become unfiled.')) return;
    try {
      await deleteDocumentFolder(id);
      if (activeFolderId === id) setActiveFolderId(null);
      showToast('Folder deleted.', 'success');
    } catch {
      showToast('Failed to delete folder.', 'error');
    }
  };

  // ── Document handlers ──────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingDoc(null);
    setIsFormOpen(true);
  };

  const openEditModal = (doc: Document, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDoc(doc);
    setIsFormOpen(true);
  };

  const handleDelete = async (docId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Delete this document?')) return;
    try {
      await deleteDocument(docId);
      if (viewingDoc?.id === docId) setViewingDoc(null);
      showToast('Document deleted.', 'success');
    } catch { showToast('Failed to delete document', 'error'); }
  };

  const handleDocFormSuccess = () => {
    setCurrentPage(1);
    if (editingDoc && viewingDoc?.id === editingDoc.id) {
      setViewingDoc(null);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────

  const activeFolder = initialFolders.find(f => f.id === activeFolderId) ?? null;

  const viewDocs = initialDocuments.filter(d =>
    activeFolderId === null ? d.folderId === null : d.folderId === activeFolderId
  );

  const filteredDocs = viewDocs.filter(doc => {
    const term = search.toLowerCase();
    return doc.title.toLowerCase().includes(term) ||
      (doc.notes && doc.notes.toLowerCase().includes(term)) ||
      doc.link.toLowerCase().includes(term);
  });

  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(filteredDocs.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedDocs = filteredDocs.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const countInFolder = (id: number) => initialDocuments.filter(d => d.folderId === id).length;
  const unfiledCount = initialDocuments.filter(d => d.folderId === null).length;

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-on-surface-variant)' }} />
          <input
            type="text"
            placeholder={activeFolderId ? `Search in "${activeFolder?.name}"…` : 'Search unfiled documents…'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="search-input"
            style={{ width: '100%', paddingLeft: '44px', borderRadius: '12px', height: '44px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {activeFolderId === null && (
            <button onClick={openAddFolder} className="primary-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none', border: '1px solid var(--c-outline-variant)' }}>
              <FolderPlus size={17} /> New Folder
            </button>
          )}
          <button onClick={openAddModal} className="primary-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700 }}>
            <Plus size={18} /> Add Document
          </button>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '13px', fontWeight: 600, color: 'var(--c-on-surface-variant)' }}>
        <button onClick={() => { setActiveFolderId(null); setSearch(''); setCurrentPage(1); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeFolderId ? 'var(--c-primary)' : 'var(--c-on-surface)', fontWeight: 700, fontSize: '13px', padding: 0 }}>
          All Documents
        </button>
        {activeFolder && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--c-on-surface)' }}>{activeFolder.name}</span>
          </>
        )}
      </div>

      {/* ── Folders grid (root only) ── */}
      {activeFolderId === null && initialFolders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {initialFolders.map(folder => (
            <DocumentFolderCard
              key={folder.id}
              folder={folder}
              count={countInFolder(folder.id)}
              onClick={setActiveFolderId}
              onRename={openRenameFolder}
              onDelete={handleDeleteFolder}
            />
          ))}
        </div>
      )}

      {/* ── Unfiled label (root only when there are folders) ── */}
      {activeFolderId === null && initialFolders.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--c-on-surface-variant)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <FolderOpen size={16} />
          <span>Unfiled Documents ({unfiledCount})</span>
        </div>
      )}

      {/* ── Documents grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {paginatedDocs.length === 0 ? (
          <p className="text-on-surface-variant text-body-md" style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1', fontStyle: 'italic' }}>
            No documents found.
          </p>
        ) : (
          paginatedDocs.map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onView={setViewingDoc}
              onEdit={(d, e) => openEditModal(d, e)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button disabled={activePage <= 1} onClick={() => setCurrentPage(activePage - 1)} className="primary-btn"
            style={{ padding: '8px 16px', backgroundColor: activePage <= 1 ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage <= 1 ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage <= 1 ? 0.5 : 1, cursor: activePage <= 1 ? 'not-allowed' : 'pointer', boxShadow: 'none' }}>
            Previous
          </button>
          <span className="text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>Page {activePage} of {totalPages}</span>
          <button disabled={activePage >= totalPages} onClick={() => setCurrentPage(activePage + 1)} className="primary-btn"
            style={{ padding: '8px 16px', backgroundColor: activePage >= totalPages ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage >= totalPages ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage >= totalPages ? 0.5 : 1, cursor: activePage >= totalPages ? 'not-allowed' : 'pointer', boxShadow: 'none' }}>
            Next
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      <DocumentFolderModal
        isOpen={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        editingFolder={editingFolder}
      />

      <DocumentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingDoc={editingDoc}
        activeFolderId={activeFolderId}
        folders={initialFolders}
        onSuccess={handleDocFormSuccess}
      />

      <DocumentViewerModal
        viewingDoc={viewingDoc}
        folders={initialFolders}
        onClose={() => setViewingDoc(null)}
        onEdit={(d) => openEditModal(d)}
        onDelete={(id) => handleDelete(id)}
      />
    </div>
  );
}
