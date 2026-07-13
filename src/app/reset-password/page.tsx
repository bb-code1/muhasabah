'use client';

import { useState, Suspense } from 'react';
import { KeyRound } from 'lucide-react';
import { resetPassword } from '@/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!token) {
      setError('Invalid or missing reset token.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('token', token);
    
    const result = await resetPassword(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', backgroundColor: 'var(--c-surface-container-lowest)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--c-primary-container)', padding: '1rem', borderRadius: '50%' }}>
            <KeyRound size={32} color="var(--c-on-primary-container)" />
          </div>
        </div>
        <h2 className="text-headline-md" style={{ marginBottom: '0.5rem' }}>Reset Password</h2>
        <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '2rem' }}>Enter your new password below</p>
        
        {success ? (
          <div style={{ padding: '16px', backgroundColor: 'var(--c-primary-container)', color: 'var(--c-on-primary-container)', borderRadius: '12px', marginBottom: '24px' }}>
            <p className="text-body-md" style={{ margin: 0 }}>{success}</p>
            <Link href="/login" style={{ display: 'block', marginTop: '16px', color: 'var(--c-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              className="search-input"
              style={{ width: '100%', paddingLeft: '16px' }}
              minLength={6}
              autoFocus
              required
            />

            {error && <p className="text-label-sm" style={{ color: 'var(--c-error)', textAlign: 'left', margin: 0 }}>{error}</p>}
            
            <button type="submit" className="primary-btn" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
