'use client';

import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { addPerson } from '@/features/debts/actions';

export default function AddPersonDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="primary-btn" 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <UserPlus size={20} /> Add Person
      </button>

      {isOpen && (
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
        >
          <div 
            className="card" 
            style={{ 
              maxWidth: '420px', 
              width: '100%', 
              position: 'relative', 
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <button 
              onClick={() => setIsOpen(false)} 
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
                padding: '4px',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-surface-container-high)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
            
            <div>
              <h3 className="text-title-md" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <UserPlus size={22} style={{ color: 'var(--c-primary)' }} />
                Add New Contact
              </h3>
              <p className="text-label-sm text-on-surface-variant" style={{ marginTop: '4px', textTransform: 'none', fontWeight: 500 }}>
                Create a contact to start tracking credit and debit balances.
              </p>
            </div>
            
            <form action={async (formData) => {
              await addPerson(formData);
              setIsOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="text-label-sm text-on-surface-variant" style={{ fontWeight: 600 }}>Contact Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter full name..." 
                  className="search-input" 
                  required 
                  autoFocus
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="primary-btn" 
                  style={{ 
                    flex: 1, 
                    backgroundColor: 'var(--c-surface-container-high)', 
                    color: 'var(--c-on-surface)', 
                    boxShadow: 'none',
                    border: '1px solid var(--c-outline-variant)'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-btn" 
                  style={{ flex: 1 }}
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
