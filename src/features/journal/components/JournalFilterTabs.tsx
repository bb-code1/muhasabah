'use client';

interface Props {
  filterPeriod: string;
  onFilterChange: (period: string) => void;
}

const filterTabs = [
  { id: 'TODAY', label: 'Today' },
  { id: 'WEEK', label: 'This Week' },
  { id: 'MONTH', label: 'This Month' },
  { id: 'YEAR', label: 'This Year' },
  { id: 'ALL', label: 'All Time' },
  { id: 'CUSTOM', label: 'Custom Range' },
];

export default function JournalFilterTabs({ filterPeriod, onFilterChange }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
      {filterTabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          style={{
            padding: '8px 16px',
            borderRadius: '24px',
            fontWeight: 600,
            fontSize: '13px',
            backgroundColor: filterPeriod === tab.id ? 'var(--c-primary)' : 'var(--c-surface-container-high)',
            color: filterPeriod === tab.id ? 'var(--c-on-primary)' : 'var(--c-on-surface-variant)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
