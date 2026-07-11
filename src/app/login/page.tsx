'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { loginAction } from '@/actions';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', backgroundColor: 'var(--c-surface-container-lowest)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--c-primary-container)', padding: '1rem', borderRadius: '50%' }}>
            <Lock size={32} color="var(--c-on-primary)" />
          </div>
        </div>
        <h2 className="text-headline-md" style={{ marginBottom: '0.5rem' }}>Personal Access</h2>
        <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '2rem' }}>Enter your app password to continue to Muhasabah</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="App Password"
            className="search-input"
            style={{ width: '100%', marginBottom: '16px', paddingLeft: '16px' }}
            autoFocus
            required
          />
          {error && <p className="text-label-sm" style={{ color: 'var(--c-error)', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="primary-btn" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
