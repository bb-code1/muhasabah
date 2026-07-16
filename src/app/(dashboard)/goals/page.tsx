import { getGoals } from '@/actions/index';
import { Target } from 'lucide-react';
import { GoalsDashboard } from "@/features/goals/components/GoalsDashboard";

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Target color="var(--c-primary)" />
        <h2 className="text-headline-md" style={{ margin: 0 }}>My Goals</h2>
      </div>

      <GoalsDashboard goals={goals} />
    </div>
  );
}
