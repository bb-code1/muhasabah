'use client';

import { useState, useEffect } from 'react';
import { changePassword } from '@/actions/auth';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function ChangePasswordForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
      (e.target as HTMLFormElement).reset();
      // Keep modal open briefly to show success, or close immediately. 
      // Let's keep it open so they see the success message.
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button 
        onClick={() => setIsOpen(true)} 
        className="primary-btn" 
        style={{ padding: '10px 20px', borderRadius: '8px', width: 'fit-content' }}
      >
        Change Password
      </button>

      {isOpen && mounted && createPortal(
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(4px)' }}
          onClick={() => {
            setIsOpen(false);
            setError('');
            setSuccess('');
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '24px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="text-title-lg" style={{ margin: 0, fontWeight: 700 }}>Change Password</h3>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setError('');
                  setSuccess('');
                }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-md" style={{ fontWeight: 600 }}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '16px', borderRadius: '8px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-md" style={{ fontWeight: 600 }}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password (min 6 chars)"
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '16px', borderRadius: '8px' }}
                  minLength={6}
                  required
                />
              </div>

              {error && <p className="text-label-sm" style={{ color: 'var(--c-error)', margin: 0, textAlign: 'left' }}>{error}</p>}
              {success && <p className="text-label-sm" style={{ color: 'var(--c-primary)', margin: 0, textAlign: 'left' }}>{success}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                    setSuccess('');
                  }} 
                  style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={loading} style={{ padding: '10px 24px', borderRadius: '8px' }}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
