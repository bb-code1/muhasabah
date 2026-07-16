import { getFitnessLogs } from '@/features/fitness/actions';
import FitnessDashboard from "@/features/fitness/components/FitnessDashboard";
import { Dumbbell } from 'lucide-react';

export default async function FitnessPage() {
  const logs = await getFitnessLogs();

  return (
    <div style={{ padding: '0 24px 60px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Dumbbell color="var(--c-primary)" size={28} />
        <h2 className="text-headline-md" style={{ margin: 0 }}>Fitness Tracker</h2>
      </div>

      <FitnessDashboard initialLogs={logs} />
    </div>
  );
}
