import { getGoals, addGoal } from '@/actions';
import { Target, Plus } from 'lucide-react';
import { GoalItem } from './GoalItem';

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Target color="var(--c-primary)" />
        <h2 className="text-headline-md" style={{ margin: 0 }}>My Goals</h2>
      </div>

      <form action={addGoal} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <input 
          type="text" 
          name="title"
          placeholder="New Goal Title" 
          className="search-input"
          required 
          style={{ flex: 2, minWidth: '200px', borderRadius: '8px' }}
        />
        <input 
          type="date" 
          name="targetDate"
          className="search-input"
          style={{ flex: 1, minWidth: '150px', borderRadius: '8px' }}
        />
        <button type="submit" className="primary-btn" style={{ flex: 1, minWidth: '150px', borderRadius: '8px' }}>
          <Plus size={20} /> Create
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {goals.map(goal => (
          <GoalItem key={goal.id} goal={goal} />
        ))}
        {goals.length === 0 && <p className="text-on-surface-variant">No goals created yet.</p>}
      </div>
    </div>
  );
}
