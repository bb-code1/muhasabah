import { getFocusSessions } from '@/features/tools/actions';
import ToolsDashboard from '@/features/tools/components/ToolsDashboard';

export default async function ToolsPage() {
  const sessions = await getFocusSessions();

  return (
    <div style={{ padding: '0 24px 60px 24px' }}>
      <ToolsDashboard initialSessions={sessions} />
    </div>
  );
}
