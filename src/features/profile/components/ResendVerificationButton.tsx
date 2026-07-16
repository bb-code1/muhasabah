'use client';

import { useState } from 'react';
import { resendVerificationEmailAction } from '@/features/auth/actions';
import { Mail } from 'lucide-react';

export default function ResendVerificationButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    const result = await resendVerificationEmailAction();

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
      <button
        onClick={handleClick}
        className="primary-btn"
        style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', width: 'fit-content' }}
        disabled={loading}
      >
        <Mail size={16} /> {loading ? 'Sending...' : 'Send Verification Link'}
      </button>
      {success && <p className="text-label-sm" style={{ color: 'var(--c-primary)', margin: 0 }}>{success}</p>}
      {error && <p className="text-label-sm" style={{ color: 'var(--c-error)', margin: 0 }}>{error}</p>}
    </div>
  );
}
