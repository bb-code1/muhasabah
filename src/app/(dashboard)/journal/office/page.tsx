import { getJournalEntries } from '@/actions/index';
import { Briefcase } from 'lucide-react';
import JournalDashboard from "@/features/journal/components/JournalDashboard";

export default async function OfficeJournalPage() {
  const entries = await getJournalEntries('OFFICE');

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Briefcase color="var(--c-primary)" size={28} />
        <h2 className="text-headline-md" style={{ margin: 0 }}>Office Work</h2>
      </div>
      <JournalDashboard category="OFFICE" initialEntries={entries} />
    </div>
  );
}
