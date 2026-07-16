import { getJournalEntries } from '@/actions/index';
import { FolderOpen } from 'lucide-react';
import JournalDashboard from "@/features/journal/components/JournalDashboard";

export default async function MiscJournalPage() {
  const entries = await getJournalEntries('MISC');

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <FolderOpen color="var(--c-primary)" size={28} />
        <h2 className="text-headline-md" style={{ margin: 0 }}>Miscellaneous</h2>
      </div>
      <JournalDashboard category="MISC" initialEntries={entries} />
    </div>
  );
}
