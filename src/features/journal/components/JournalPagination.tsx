'use client';

interface Props {
  activePage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function JournalPagination({ activePage, totalPages, setCurrentPage }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
      <button
        disabled={activePage <= 1}
        onClick={() => setCurrentPage(activePage - 1)}
        className="primary-btn"
        style={{ 
          padding: '8px 16px', 
          borderRadius: '8px', 
          backgroundColor: activePage <= 1 ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', 
          color: activePage <= 1 ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', 
          opacity: activePage <= 1 ? 0.5 : 1, 
          cursor: activePage <= 1 ? 'not-allowed' : 'pointer', 
          boxShadow: 'none' 
        }}
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
        style={{ 
          padding: '8px 16px', 
          borderRadius: '8px', 
          backgroundColor: activePage >= totalPages ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', 
          color: activePage >= totalPages ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', 
          opacity: activePage >= totalPages ? 0.5 : 1, 
          cursor: activePage >= totalPages ? 'not-allowed' : 'pointer', 
          boxShadow: 'none' 
        }}
      >
        Next
      </button>
    </div>
  );
}
