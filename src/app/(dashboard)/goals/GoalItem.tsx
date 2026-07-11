'use client';

import { toggleGoal } from '@/actions';

export function GoalItem({ goal }: { goal: any }) {
  const isCompleted = goal.isCompleted;
  const handleToggle = () => toggleGoal(goal.id, isCompleted);

  return (
    <div className="habit-item" style={{ backgroundColor: 'var(--c-surface-container-low)', padding: '16px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={handleToggle}
          className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
        </button>
        <div>
          <p className="text-body-md" style={{ fontWeight: 600, textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.6 : 1 }}>
            {goal.title}
          </p>
          {goal.targetDate && (
            <p className="text-label-sm text-on-surface-variant">
              Target: {new Date(goal.targetDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
