'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X } from 'lucide-react';
import { addDebtRecord } from '@/features/debts/actions';

export default function AddDebtRecordForm({ personId }: { personId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <>
      <div style={{ marginBottom: '40px' }}>
        <button 
          onClick={() => setShowForm(true)} 
          className="primary-btn" 
          style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      {showForm && mounted && createPortal(
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 1000, 
            padding: '16px', 
            backdropFilter: 'blur(4px)' 
          }}
          onClick={() => setShowForm(false)}
        >
          <div 
            className="card" 
            style={{ 
              maxWidth: '500px', 
              width: '100%', 
              position: 'relative', 
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: 'var(--c-surface)',
              border: '1px solid var(--c-outline-variant)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={() => setShowForm(false)} 
              style={{ 
                position: 'absolute', 
                top: '16px', 
                right: '16px', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--c-on-surface-variant)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-surface-container-high)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Close"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-headline-sm" style={{ fontWeight: 700, margin: 0, color: 'var(--c-on-surface)' }}>
                Add Transaction
              </h3>
              <p className="text-label-sm text-on-surface-variant" style={{ marginTop: '6px' }}>
                Log a credit or debit entry for this person.
              </p>
            </div>

            <form 
              action={async (formData) => {
                await addDebtRecord(formData);
                setShowForm(false);
              }} 
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <input type="hidden" name="personId" value={personId} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-sm text-on-surface" style={{ fontWeight: 600 }}>Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="amount" 
                  placeholder="0.00" 
                  className="search-input" 
                  required 
                  autoFocus
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-sm text-on-surface" style={{ fontWeight: 600 }}>Transaction Type</label>
                <select name="type" className="search-input" required style={{ borderRadius: '8px', WebkitAppearance: 'none' }}>
                  <option value="CREDIT">I gave them money (Credit)</option>
                  <option value="DEBIT">I borrowed money (Debit)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-sm text-on-surface" style={{ fontWeight: 600 }}>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  className="search-input" 
                  defaultValue={new Date().toISOString().split('T')[0]} 
                  required 
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-sm text-on-surface" style={{ fontWeight: 600 }}>Notes (optional)</label>
                <input 
                  type="text" 
                  name="notes" 
                  placeholder="e.g. For dinner, rent share" 
                  className="search-input" 
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="primary-btn" 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px',
                    backgroundColor: 'var(--c-surface-container-high)', 
                    color: 'var(--c-on-surface)', 
                    boxShadow: 'none',
                    border: '1px solid var(--c-outline-variant)',
                    backgroundImage: 'none',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-btn" 
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} /> Add Record
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
