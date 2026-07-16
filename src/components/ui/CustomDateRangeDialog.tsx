'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CustomDateRangeDialogProps {
  initialStartDate: string;
  initialEndDate: string;
  onApply: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

export default function CustomDateRangeDialog({
  initialStartDate,
  initialEndDate,
  onApply,
  onClose,
}: CustomDateRangeDialogProps) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const isRangeValid = Boolean(startDate && endDate && startDate <= endDate);

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-date-range-title"
        onClick={(event) => event.stopPropagation()}
        className="card"
        style={{ width: '100%', maxWidth: '440px', padding: '24px', borderRadius: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 id="custom-date-range-title" className="text-title-lg" style={{ margin: 0, fontWeight: 700 }}>Custom date range</h2>
            <p className="text-body-sm text-on-surface-variant" style={{ margin: '4px 0 0' }}>Choose the start and end dates to filter by.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close custom date range" style={{ border: 'none', background: 'transparent', color: 'var(--c-on-surface-variant)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
          <label className="text-label-md" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: 600 }}>
            From
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="search-input" style={{ borderRadius: '8px' }} />
          </label>
          <label className="text-label-md" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: 600 }}>
            To
            <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className="search-input" style={{ borderRadius: '8px' }} />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button type="button" onClick={onClose} className="secondary-btn" style={{ padding: '9px 16px', borderRadius: '8px' }}>Cancel</button>
          <button type="button" onClick={() => onApply(startDate, endDate)} disabled={!isRangeValid} className="primary-btn" style={{ padding: '9px 16px', borderRadius: '8px', opacity: isRangeValid ? 1 : 0.5, cursor: isRangeValid ? 'pointer' : 'not-allowed' }}>Apply range</button>
        </div>
      </div>
    </div>
  );
}
