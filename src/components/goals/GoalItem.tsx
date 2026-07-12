'use client';

import { toggleGoal } from '@/actions';
import { Clock } from 'lucide-react';
import { Goal } from '@prisma/client';

export function GoalItem({ goal, onClick }: { goal: Goal; onClick: () => void }) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening details modal
    toggleGoal(goal.id, goal.isCompleted);
  };

  // Overdue check
  const isOverdue = goal.targetDate && new Date(goal.targetDate) < new Date() && !goal.isCompleted;

  // Priority Colors
  const priorityColors = {
    HIGH: { bg: 'var(--c-error-container)', text: 'var(--c-on-error-container)' },
    MEDIUM: { bg: 'var(--c-secondary-container)', text: 'var(--c-on-secondary-container)' },
    LOW: { bg: 'var(--c-surface-variant)', text: 'var(--c-on-surface-variant)' },
  };
  const colors = priorityColors[goal.priority as keyof typeof priorityColors] || priorityColors.MEDIUM;

  return (
    <div 
      className="card flex-col gap-12" 
      onClick={onClick}
      style={{ 
        backgroundColor: 'var(--c-surface-container-low)', 
        cursor: 'pointer',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--c-outline-variant)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <button 
            onClick={handleToggle}
            className={`habit-checkbox ${goal.isCompleted ? 'checked' : ''}`}
            style={{ marginTop: '4px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
          </button>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <p className="text-body-md" style={{ fontWeight: 600, margin: 0, textDecoration: goal.isCompleted ? 'line-through' : 'none', color: 'var(--c-on-surface)' }}>
                {goal.title}
              </p>
              <span style={{ backgroundColor: colors.bg, color: colors.text, padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {goal.priority}
              </span>
              {isOverdue && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--c-error)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  <Clock size={12} /> OVERDUE
                </span>
              )}
            </div>

            {goal.description && (
              <p className="text-label-sm text-on-surface-variant" style={{ marginTop: '4px', margin: '4px 0 0', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {goal.description}
              </p>
            )}

            {goal.targetDate && (
              <p className="text-label-sm text-on-surface-variant" style={{ marginTop: '4px', margin: '4px 0 0' }}>
                Target: {new Date(goal.targetDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar Area */}
      <div style={{ paddingLeft: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--c-surface-container-highest)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${goal.progress}%`, height: '100%', backgroundColor: 'var(--c-primary)', borderRadius: '3px' }} />
        </div>
        <span className="text-label-sm" style={{ fontWeight: 'bold', minWidth: '40px', color: 'var(--c-on-surface-variant)' }}>
          {goal.progress}%
        </span>
      </div>
    </div>
  );
}
