'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmButton({
  action,
  iconSize = 18,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  style = {}
}: {
  action: () => Promise<void> | void;
  iconSize?: number;
  title?: string;
  message?: string;
  style?: React.CSSProperties;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await action();
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        alert("Failed to delete item.");
      }
    });
  };

  const modalContent = isOpen && mounted ? (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 9999, 
        padding: '16px', 
        backdropFilter: 'blur(4px)' 
      }}
    >
      <div 
        className="card" 
        style={{ 
          maxWidth: '400px', 
          width: '100%', 
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-lg)',
          backgroundColor: 'var(--c-surface)',
          border: '1px solid var(--c-outline-variant)'
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: 'var(--c-primary-container)', color: 'var(--c-primary)', padding: '10px', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="text-title-md" style={{ fontWeight: 700, margin: 0, color: 'var(--c-on-surface)' }}>{title}</h3>
            <p className="text-body-md text-on-surface-variant" style={{ marginTop: '8px', fontSize: '14px', lineHeight: '20px' }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button 
            type="button" 
            onClick={() => setIsOpen(false)} 
            className="primary-btn" 
            disabled={isPending}
            style={{ 
              backgroundColor: 'var(--c-surface-container-high)', 
              color: 'var(--c-on-surface)', 
              boxShadow: 'none',
              border: '1px solid var(--c-outline-variant)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundImage: 'none'
            }}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleConfirm} 
            className="primary-btn" 
            disabled={isPending}
            style={{ 
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsOpen(true)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          padding: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'var(--c-error)', 
          opacity: 0.7, 
          transition: 'all 0.2s',
          borderRadius: '50%',
          ...style 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.backgroundColor = 'var(--c-error-container)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title={title}
      >
        <Trash2 size={iconSize} />
      </button>

      {isOpen && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
