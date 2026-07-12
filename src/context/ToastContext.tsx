'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000); // Auto dismiss after 4 seconds
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted && toasts.length > 0 && createPortal(
        <div 
          style={{ 
            position: 'fixed', 
            bottom: '40px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 99999, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            alignItems: 'center',
            pointerEvents: 'none'
          }}
        >
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className="card"
              style={{ 
                padding: '12px 24px', 
                borderRadius: '50px', 
                backgroundColor: 'var(--c-surface-container-high)', 
                border: '1px solid var(--c-outline-variant)',
                color: toast.type === 'error' ? 'var(--c-error)' : 'var(--c-primary)', 
                boxShadow: 'var(--shadow-lg)',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'auto',
                animation: 'slideUpFade 0.3s ease-out forwards',
                maxWidth: '90vw',
                textAlign: 'center'
              }}
            >
              {toast.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
