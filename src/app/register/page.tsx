'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { register } from '@/features/auth/actions';
import Link from 'next/link';

export default function Register() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.currentTarget);
    const result = await register(formData);
    
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
            <UserPlus size={32} color="var(--c-on-primary-container)" />
          </div>
        </div>
        <h2 className="text-headline-md" style={{ marginBottom: '0.5rem' }}>Create Account</h2>
        <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '2rem' }}>Join Muhasabah to track your progress</p>
        
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
              type="text"
              name="name"
              placeholder="Full Name"
              className="search-input"
              style={{ width: '100%', paddingLeft: '16px' }}
              autoFocus
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="search-input"
              style={{ width: '100%', paddingLeft: '16px' }}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="search-input"
              style={{ width: '100%', paddingLeft: '16px' }}
              minLength={6}
              required
            />

            {error && <p className="text-label-sm" style={{ color: 'var(--c-error)', textAlign: 'left', margin: 0 }}>{error}</p>}
            
            <button type="submit" className="primary-btn" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            <p className="text-body-sm text-on-surface-variant" style={{ marginTop: '16px' }}>
              Already have an account? <Link href="/login" style={{ color: 'var(--c-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
