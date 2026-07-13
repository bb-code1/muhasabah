import { getAuthenticatedUser } from '@/actions/auth';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';
import Link from 'next/link';

export default async function Profile() {
  const user = await getAuthenticatedUser();
  if (!user) return null; // Middleware will handle redirect

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="text-display-sm" style={{ marginBottom: '8px' }}>Your Profile</h1>
        <p className="text-body-lg text-on-surface-variant">Manage your account settings and preferences.</p>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 className="text-title-lg" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={24} color="var(--c-primary)" />
          Personal Details
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span className="text-label-sm text-on-surface-variant">FULL NAME</span>
            <div className="text-body-lg" style={{ marginTop: '4px' }}>{user.name}</div>
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant">EMAIL ADDRESS</span>
            <div className="text-body-lg" style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user.email}
              {user.emailVerified && <ShieldCheck size={18} color="var(--c-primary)" />}
            </div>
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant">MEMBER SINCE</span>
            <div className="text-body-lg" style={{ marginTop: '4px' }}>
              {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 className="text-title-lg" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={24} color="var(--c-primary)" />
          Security
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="text-body-md text-on-surface-variant">
            To change your password, you can request a password reset link to your email.
          </p>
          <Link href="/forgot-password" style={{ display: 'inline-block', width: 'fit-content' }}>
            <button className="secondary-btn" style={{ padding: '8px 16px' }}>
              Change Password
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
