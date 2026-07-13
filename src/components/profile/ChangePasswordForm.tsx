'use client';

import { useState } from 'react';
import { changePassword } from '@/actions/auth';

export default function ChangePasswordForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="secondary-btn" 
        style={{ padding: '8px 16px', width: 'fit-content' }}
      >
        Change Password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', width: '100%', marginTop: '16px' }}>
      <input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        className="search-input"
        style={{ width: '100%', paddingLeft: '16px', borderRadius: '8px' }}
        required
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password (min 6 chars)"
        className="search-input"
        style={{ width: '100%', paddingLeft: '16px', borderRadius: '8px' }}
        minLength={6}
        required
      />

      {error && <p className="text-label-sm" style={{ color: 'var(--c-error)', margin: 0, textAlign: 'left' }}>{error}</p>}
      {success && <p className="text-label-sm" style={{ color: 'var(--c-primary)', margin: 0, textAlign: 'left' }}>{success}</p>}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" className="primary-btn" style={{ padding: '8px 16px' }} disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
        <button 
          type="button" 
          onClick={() => {
            setIsOpen(false);
            setError('');
            setSuccess('');
          }} 
          className="secondary-btn" 
          style={{ padding: '8px 16px' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
