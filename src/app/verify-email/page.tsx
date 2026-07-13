'use client';

import { useEffect, useState, Suspense } from 'react';
import { MailCheck, XCircle } from 'lucide-react';
import { verifyEmail } from '@/actions/auth';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    verifyEmail(token).then((result) => {
      if (result.error) {
        setStatus('error');
        setMessage(result.error);
      } else if (result.success) {
        setStatus('success');
        setMessage(result.success);
      }
    });
  }, [token]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', backgroundColor: 'var(--c-surface-container-lowest)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            backgroundColor: status === 'success' ? 'var(--c-primary-container)' : status === 'error' ? 'var(--c-error-container)' : 'var(--c-surface-variant)', 
            padding: '1rem', 
            borderRadius: '50%' 
          }}>
            {status === 'success' && <MailCheck size={32} color="var(--c-on-primary-container)" />}
            {status === 'error' && <XCircle size={32} color="var(--c-on-error-container)" />}
            {status === 'loading' && <MailCheck size={32} color="var(--c-on-surface-variant)" />}
          </div>
        </div>
        
        <h2 className="text-headline-md" style={{ marginBottom: '0.5rem' }}>
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Verification Failed'}
        </h2>
        
        <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '2rem' }}>
          {message}
        </p>
        
        {(status === 'success' || status === 'error') && (
          <Link href="/login" className="primary-btn" style={{ display: 'inline-block', width: '100%', padding: '12px', textDecoration: 'none' }}>
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
