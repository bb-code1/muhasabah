'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { addGoal } from '@/actions';
import { GoalCategory } from '@prisma/client';

export function AddGoalForm({ activeCategory }: { activeCategory: GoalCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="primary-btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', marginBottom: '24px' }}
      >
        <Plus size={20} /> Create New Goal
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '32px', border: '1px solid var(--c-primary)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="text-title-md" style={{ fontWeight: 600 }}>New Goal</h3>
        <button onClick={() => setIsOpen(false)} style={{ color: 'var(--c-on-surface-variant)' }}>
          <X size={24} />
        </button>
      </div>

      <form 
        action={async (formData) => {
          await addGoal(formData);
          setIsOpen(false);
        }} 
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            name="title"
            placeholder="Goal Title" 
            className="search-input"
            required 
            style={{ flex: 2, minWidth: '200px', borderRadius: '8px' }}
          />
          <select 
            name="category" 
            defaultValue={activeCategory} 
            className="search-input" 
            style={{ flex: 1, minWidth: '150px', borderRadius: '8px' }}
          >
            <option value="RELIGIOUS">Religious</option>
            <option value="CAREER">Career</option>
            <option value="FINANCES">Finances</option>
            <option value="HEALTH">Health & Fitness</option>
            <option value="PERSONAL">Personal</option>
          </select>
          <select name="priority" className="search-input" style={{ flex: 1, minWidth: '150px', borderRadius: '8px' }}>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM" defaultValue="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
        </div>

        <input 
          type="text" 
          name="description"
          placeholder="Description (Optional)" 
          className="search-input"
          style={{ width: '100%', borderRadius: '8px' }}
        />

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
            <label className="text-label-sm text-on-surface-variant" style={{ marginBottom: '4px' }}>Target Date (Optional)</label>
            <input 
              type="date" 
              name="targetDate"
              className="search-input"
              style={{ borderRadius: '8px' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" name="reminders" value="true" id="reminders" style={{ width: '20px', height: '20px', accentColor: 'var(--c-primary)' }} />
            <label htmlFor="reminders" className="text-body-md">Enable Reminders</label>
          </div>
          <button type="submit" className="primary-btn" style={{ flex: 1, minWidth: '150px', padding: '12px', borderRadius: '8px' }}>
            Save Goal
          </button>
        </div>
      </form>
    </div>
  );
}
