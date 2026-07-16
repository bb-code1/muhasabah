import { AlertTriangle } from 'lucide-react';

interface FilterSectionProps {
  filterTabs: { id: string; label: string }[];
  filterPeriod: string;
  handleFilterChange: (newPeriod: string) => void;
  filteredLogsCount: number;
}

export default function FilterSection({
  filterTabs,
  filterPeriod,
  handleFilterChange,
  filteredLogsCount,
}: FilterSectionProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
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

      <div style={{ padding: '6px 12px', borderRadius: '12px', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <AlertTriangle size={14} />
        <span>Count in Selected Period: {filteredLogsCount}</span>
      </div>
    </div>
  );
}
