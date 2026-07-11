'use client';

import { useState } from 'react';
import { toggleReligiousActivity, toggleGoal } from '@/actions';

export default function DailyFocus({ religiousData, dateStr, goals }: { religiousData: any, dateStr: string, goals: any[] }) {
  const [relData, setRelData] = useState(religiousData || {});
  
  const handleRelToggle = async (field: string, currentValue: boolean) => {
    const newValue = !currentValue;
    setRelData({ ...relData, [field]: newValue }); // Optimistic
    try {
      await toggleReligiousActivity(dateStr, field, currentValue);
    } catch (e) {
      setRelData({ ...relData, [field]: currentValue }); // Revert
    }
  };

  const activeGoals = goals.filter(g => !g.isCompleted).slice(0, 2);

  return (
    <div className="card col-span-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h3 className="text-headline-md">Daily Focus</h3>
          <p className="text-label-sm text-on-surface-variant">Focus on today</p>
        </div>
        <div style={{ display: 'flex', marginLeft: '-8px' }}>
          {['S', 'M', 'T'].map((day, i) => (
            <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--c-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginLeft: i > 0 ? '-8px' : '0', backgroundColor: i === 2 ? 'var(--c-secondary)' : 'var(--c-secondary-fixed)', color: i === 2 ? 'white' : 'var(--c-on-secondary-fixed)' }}>
              {day}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Render some goals as habits */}
        {activeGoals.map(goal => (
          <div key={goal.id} className="habit-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                className={`habit-checkbox ${goal.isCompleted ? 'checked' : ''}`}
                onClick={() => toggleGoal(goal.id, goal.isCompleted)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
              </button>
              <div>
                <p className="text-body-md" style={{ fontWeight: 600 }}>{goal.title}</p>
                <p className="text-label-sm text-on-surface-variant">Active Goal</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
          </div>
        ))}

        {/* Render a religious activity */}
        <div className="habit-item" style={{ backgroundColor: 'var(--c-surface-container-low)', padding: '16px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className={`habit-checkbox ${relData.quranReading ? 'checked' : ''}`}
              onClick={() => handleRelToggle('quranReading', relData.quranReading)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
            </button>
            <div>
              <p className="text-body-md" style={{ fontWeight: 600 }}>Quran Reading</p>
              <p className="text-label-sm" style={{ color: 'var(--c-on-secondary-fixed-variant)' }}>Spiritual</p>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ color: 'var(--c-on-secondary-fixed-variant)' }}>auto_awesome</span>
        </div>

      </div>
    </div>
  );
}
