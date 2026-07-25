'use client';

import Link from 'next/link';

interface DashboardFinancialOverviewProps {
  dailySpending: number;
  weeklySpending: number;
  monthlySpending: number;
  yearlySpending: number;
}

export default function DashboardFinancialOverview({
  dailySpending,
  weeklySpending,
  monthlySpending,
  yearlySpending,
}: DashboardFinancialOverviewProps) {
  const items = [
    { label: 'TODAY', value: `$${dailySpending.toFixed(2)}` },
    { label: 'THIS WEEK', value: `$${weeklySpending.toFixed(2)}` },
    { label: 'THIS MONTH', value: `$${monthlySpending.toFixed(2)}`, highlight: true },
    { label: 'THIS YEAR', value: `$${yearlySpending.toFixed(2)}` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      <h4 className="text-title-sm" style={{ fontWeight: 700, color: 'var(--c-on-surface-variant)', margin: 0 }}>
        Finance Expenses
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', flexGrow: 1 }}>
        {items.map((item, i) => (
          <Link
            key={i}
            href="/transactions"
            className={`card flex-col justify-center ${item.highlight ? 'highlight-card' : ''}`}
            style={{
              backgroundColor: 'var(--c-surface-container-high)',
              borderTop: item.highlight ? '3px solid var(--c-primary)' : '1px solid var(--c-outline-variant)',
              padding: '16px 20px',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <span className="text-label-sm text-on-surface-variant mb-8">{item.label}</span>
            <h3 className="summary-amount" style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
              {item.value}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
