'use client';

import Link from 'next/link';

interface DashboardLedgerOverviewProps {
  totalTheyOweMe: number;
  totalIOweThem: number;
}

export default function DashboardLedgerOverview({
  totalTheyOweMe,
  totalIOweThem,
}: DashboardLedgerOverviewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h4 className="text-title-sm" style={{ fontWeight: 700, color: 'var(--c-on-surface-variant)', margin: 0 }}>
        Ledger
      </h4>
      <Link
        href="/debts"
        className="card"
        style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--c-surface-container-high)',
          border: '1px solid var(--c-outline-variant)',
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flexGrow: 1,
          justifyContent: 'center',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              NET BALANCE STATUS
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--c-on-surface-variant)' }}>
              arrow_forward
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--c-surface)',
                borderLeft: '4px solid var(--c-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>THEY OWE YOU</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--c-primary)' }}>
                ${totalTheyOweMe.toFixed(2)}
              </span>
            </div>

            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--c-surface)',
                borderLeft: '4px solid var(--c-error)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>YOU OWE THEM</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--c-error)' }}>
                ${totalIOweThem.toFixed(2)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--c-on-surface-variant)', fontStyle: 'italic', marginTop: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              info
            </span>
            {totalTheyOweMe === 0 && totalIOweThem === 0 ? (
              <span>All debts are currently settled.</span>
            ) : (
              <span>
                Net Position:{' '}
                {totalTheyOweMe >= totalIOweThem ? (
                  <strong style={{ color: 'var(--c-primary)' }}>+${(totalTheyOweMe - totalIOweThem).toFixed(2)}</strong>
                ) : (
                  <strong style={{ color: 'var(--c-error)' }}>-${(totalIOweThem - totalTheyOweMe).toFixed(2)}</strong>
                )}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
