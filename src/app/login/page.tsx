'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { login } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // No else block needed as login() handles redirect on success
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', backgroundColor: 'var(--c-surface-container-lowest)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--c-primary-container)', padding: '1rem', borderRadius: '50%' }}>
            <Lock size={32} color="var(--c-on-primary-container)" />
          </div>
        </div>
        <h2 className="text-headline-md" style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '2rem' }}>Sign in to continue to Muhasabah</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="search-input"
            style={{ width: '100%', paddingLeft: '16px' }}
            autoFocus
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="search-input"
            style={{ width: '100%', paddingLeft: '16px' }}
            required
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/forgot-password" style={{ color: 'var(--c-primary)', fontSize: '13px', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-label-sm" style={{ color: 'var(--c-error)', textAlign: 'left', margin: 0 }}>{error}</p>}
          
          <button type="submit" className="primary-btn" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-body-sm text-on-surface-variant" style={{ marginTop: '16px' }}>
            Don't have an account? <Link href="/register" style={{ color: 'var(--c-primary)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
