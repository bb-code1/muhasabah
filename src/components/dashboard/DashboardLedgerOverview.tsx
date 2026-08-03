'use client';

import Link from 'next/link';

interface DashboardLedgerOverviewProps {
  overallNetBalance: number;
}

export default function DashboardLedgerOverview({
  overallNetBalance,
}: DashboardLedgerOverviewProps) {
  const isPositive = overallNetBalance > 0;
  const isNegative = overallNetBalance < 0;

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

          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--c-surface)',
              borderLeft: `4px solid ${isPositive ? 'var(--c-primary)' : isNegative ? 'var(--c-error)' : 'var(--c-on-surface-variant)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              marginTop: '4px'
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--c-on-surface-variant)', letterSpacing: '0.05em' }}>
              {isPositive ? 'THEY OWE YOU' : isNegative ? 'YOU OWE THEM' : 'SETTLED'}
            </span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: isPositive ? 'var(--c-primary)' : isNegative ? 'var(--c-error)' : 'var(--c-on-surface)' }}>
              ${Math.abs(overallNetBalance).toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

