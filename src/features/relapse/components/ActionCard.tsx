import { Plus, ShieldCheck } from 'lucide-react';

export default function ActionCard({ openAddModal }: { openAddModal: () => void }) {
  return (
    <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px dashed var(--c-outline)', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <ShieldCheck size={40} color="var(--c-primary)" />
      <div>
        <h4 className="text-title-md" style={{ margin: '0 0 4px 0', fontWeight: 700 }}>Stay Mindful</h4>
        <p className="text-label-md text-on-surface-variant" style={{ margin: 0 }}>Every minute is a victory. Log immediately to maintain accountability.</p>
      </div>
      <button onClick={openAddModal} className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Plus size={18} /> Log Occurrence
      </button>
    </div>
  );
}
