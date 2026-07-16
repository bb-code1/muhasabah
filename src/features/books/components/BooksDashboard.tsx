'use client';

import { useState } from 'react';
import { Plus, Search, FolderOpen, ChevronRight, FolderPlus } from 'lucide-react';
import { deleteBook, deleteBookFolder } from '@/features/books/actions';
import { useToast } from '@/context/ToastContext';
import { Book, BookFolder } from '@prisma/client';

import BookFolderModal from './BookFolderModal';
import BookFormModal from './BookFormModal';
import BookViewerModal from './BookViewerModal';
import BookCard from './BookCard';
import BookFolderCard from './BookFolderCard';

interface Props {
  initialBooks: Book[];
  initialFolders: BookFolder[];
}

export default function BooksDashboard({ initialBooks, initialFolders }: Props) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Folder navigation
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  // Folder management modals
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<BookFolder | null>(null);

  // Book modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // ── Folder handlers ────────────────────────────────────────────────────────

  const openAddFolder = () => { setEditingFolder(null); setIsFolderFormOpen(true); };
  const openRenameFolder = (f: BookFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(f);
    setIsFolderFormOpen(true);
  };

  const handleDeleteFolder = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this folder? Books inside will become unfiled.')) return;
    try {
      await deleteBookFolder(id);
      if (activeFolderId === id) setActiveFolderId(null);
      showToast('Folder deleted.', 'success');
    } catch {
      showToast('Failed to delete folder.', 'error');
    }
  };

  // ── Book handlers ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const openEditModal = (book: Book, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (bookId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Delete this book?')) return;
    try {
      await deleteBook(bookId);
      if (viewingBook?.id === bookId) setViewingBook(null);
      showToast('Book deleted.', 'success');
    } catch { showToast('Failed to delete book', 'error'); }
  };

  const handleBookFormSuccess = () => {
    // If we want to stay on page 1 after add/edit, we can set it here
    setCurrentPage(1);
    // Also if we were editing a viewing book, and the modal closes, we could clear it, but let's keep it simple.
    if (editingBook && viewingBook?.id === editingBook.id) {
      setViewingBook(null);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────

  const activeFolder = initialFolders.find(f => f.id === activeFolderId) ?? null;

  const viewBooks = initialBooks.filter(b =>
    activeFolderId === null ? b.folderId === null : b.folderId === activeFolderId
  );

  const filteredBooks = viewBooks.filter(book => {
    const term = search.toLowerCase();
    return book.title.toLowerCase().includes(term) ||
      (book.author && book.author.toLowerCase().includes(term)) ||
      (book.notes && book.notes.toLowerCase().includes(term));
  });

  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedBooks = filteredBooks.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const countInFolder = (id: number) => initialBooks.filter(b => b.folderId === id).length;
  const unfiledCount = initialBooks.filter(b => b.folderId === null).length;

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-on-surface-variant)' }} />
          <input type="text"
            placeholder={activeFolderId ? `Search in "${activeFolder?.name}"…` : 'Search unfiled books…'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="search-input"
            style={{ width: '100%', paddingLeft: '44px', borderRadius: '12px', height: '44px' }} />
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
            <Plus size={18} /> Add Book
          </button>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '13px', fontWeight: 600, color: 'var(--c-on-surface-variant)' }}>
        <button onClick={() => { setActiveFolderId(null); setSearch(''); setCurrentPage(1); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeFolderId ? 'var(--c-primary)' : 'var(--c-on-surface)', fontWeight: 700, fontSize: '13px', padding: 0 }}>
          All Books
        </button>
        {activeFolder && (<><ChevronRight size={14} /><span style={{ color: 'var(--c-on-surface)' }}>{activeFolder.name}</span></>)}
      </div>

      {/* ── Folders grid (root only) ── */}
      {activeFolderId === null && initialFolders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {initialFolders.map(folder => (
            <BookFolderCard
              key={folder.id}
              folder={folder}
              count={countInFolder(folder.id)}
              onClick={(id) => { setActiveFolderId(id); setSearch(''); setCurrentPage(1); }}
              onRename={openRenameFolder}
              onDelete={handleDeleteFolder}
            />
          ))}
        </div>
      )}

      {/* ── Section label ── */}
      {activeFolderId === null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FolderOpen size={16} color="var(--c-on-surface-variant)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Unfiled — {unfiledCount} item{unfiledCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* ── Books grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {paginatedBooks.length === 0 ? (
          <p className="text-on-surface-variant text-body-md" style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1', fontStyle: 'italic', fontWeight: 600 }}>
            {search ? 'No books match your search.' : activeFolderId ? 'This folder is empty. Click "Add Book" to add one.' : 'No unfiled books. Add one or open a folder.'}
          </p>
        ) : (
          paginatedBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onView={(b) => setViewingBook(b)}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button disabled={activePage <= 1} onClick={() => setCurrentPage(activePage - 1)} className="primary-btn"
            style={{ padding: '8px 16px', backgroundColor: activePage <= 1 ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage <= 1 ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage <= 1 ? 0.5 : 1, cursor: activePage <= 1 ? 'not-allowed' : 'pointer', boxShadow: 'none' }}>Previous</button>
          <span className="text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>Page {activePage} of {totalPages}</span>
          <button disabled={activePage >= totalPages} onClick={() => setCurrentPage(activePage + 1)} className="primary-btn"
            style={{ padding: '8px 16px', backgroundColor: activePage >= totalPages ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage >= totalPages ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage >= totalPages ? 0.5 : 1, cursor: activePage >= totalPages ? 'not-allowed' : 'pointer', boxShadow: 'none' }}>Next</button>
        </div>
      )}

      {/* ── Modals ── */}
      <BookViewerModal
        viewingBook={viewingBook}
        folders={initialFolders}
        onClose={() => setViewingBook(null)}
        onEdit={(book) => { setViewingBook(null); openEditModal(book); }}
        onDelete={(id) => handleDelete(id)}
      />

      <BookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingBook={editingBook}
        activeFolderId={activeFolderId}
        folders={initialFolders}
        onSuccess={handleBookFormSuccess}
      />

      <BookFolderModal
        isOpen={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        editingFolder={editingFolder}
      />
    </div>
  );
}
