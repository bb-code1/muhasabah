import { getAuthenticatedUser } from '@/actions/auth';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import UpdateProfileForm from '@/components/profile/UpdateProfileForm';
import ResendVerificationButton from '@/components/profile/ResendVerificationButton';

export default async function Profile() {
  const user = await getAuthenticatedUser();
  if (!user) return null; // Middleware will handle redirect

  return (
    <div style={{ padding: '0 24px 60px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <User color="var(--c-primary)" size={28} />
        <h2 className="text-headline-md" style={{ margin: 0 }}>User Profile</h2>
      </div>

      <div className="grid-container">
        <div className="card col-span-8" style={{ padding: '24px' }}>
          <h2 className="text-title-lg" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)' }}>
            <User size={24} />
            Personal Details
          </h2>
          
          <UpdateProfileForm initialName={user.name} initialEmail={user.email} />
          
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px' }}>
            <span className="text-label-sm text-on-surface-variant">EMAIL STATUS</span>
            <div className="text-body-lg" style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.emailVerified ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-primary)', fontWeight: 600 }}>
                    <ShieldCheck size={18} /> Verified
                  </span>
                ) : (
                  <span style={{ color: 'var(--c-error)', fontWeight: 600 }}>Unverified</span>
                )}
              </div>
              {!user.emailVerified && <ResendVerificationButton />}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <span className="text-label-sm text-on-surface-variant">MEMBER SINCE</span>
            <div className="text-body-lg" style={{ marginTop: '4px' }}>
              {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="card col-span-4" style={{ padding: '24px' }}>
          <h2 className="text-title-lg" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)' }}>
            <Mail size={24} />
            Security Settings
          </h2>
          
          <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '16px' }}>
            To change your password, input your current password and your new password.
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
