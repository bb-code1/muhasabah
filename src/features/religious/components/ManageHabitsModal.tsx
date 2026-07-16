'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus } from 'lucide-react';
import { addSpiritualHabit, deleteSpiritualHabit } from '@/features/religious/actions';
import DeleteConfirmButton from '@/components/ui/DeleteConfirmButton';
import { useToast } from '@/context/ToastContext';
import { isDefaultSpiritualHabit, sortSpiritualHabits } from '@/lib/spiritualHabits';

interface ManageHabitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allHabits: Array<{ id: number; name: string }>;
}

export default function ManageHabitsModal({ isOpen, onClose, allHabits }: ManageHabitsModalProps) {
  const { showToast } = useToast();
  const [newHabitName, setNewHabitName] = useState('');
  const [submittingHabit, setSubmittingHabit] = useState(false);

  if (!isOpen) return null;

  const sortedAllHabits = sortSpiritualHabits(allHabits);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newHabitName.trim();
    if (!name) return;

    setSubmittingHabit(true);
    try {
      await addSpiritualHabit(name);
      setNewHabitName('');
    } catch (error: unknown) {
      console.error(error);
      showToast(error instanceof Error ? error.message : 'Failed to add habit.', 'error');
    } finally {
      setSubmittingHabit(false);
    }
  };

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}
        >
          <X size={20} />
        </button>

        <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>Manage Spiritual Habits</h3>

        {/* Add Habit Form */}
        <form onSubmit={handleAddHabit} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="e.g. Tahajjud, Charity, Fasting..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="search-input"
            style={{ flex: 1, borderRadius: '8px' }}
            required
          />
          <button
            type="submit"
            className="primary-btn"
            disabled={submittingHabit}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px' }}
          >
            <Plus size={16} /> Add
          </button>
        </form>

        {/* List of current Habits */}
        <div style={{ borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
          {sortedAllHabits.map((habit) => (
            <div
              key={habit.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: 'var(--c-surface-container-low)',
                borderRadius: '8px',
                border: '1px solid var(--c-outline-variant)'
              }}
            >
              <span className="text-body-md" style={{ fontWeight: 600 }}>{habit.name}</span>
              {isDefaultSpiritualHabit(habit.name) ? (
                <span className="text-label-sm text-on-surface-variant" style={{ fontWeight: 600, padding: '4px 10px', borderRadius: '999px', backgroundColor: 'var(--c-surface-container-high)' }}>
                  Default
                </span>
              ) : (
                <DeleteConfirmButton
                  action={() => deleteSpiritualHabit(habit.id)}
                  iconSize={16}
                  title="Delete Habit"
                  message="Are you sure you want to delete this habit? All past logs for this habit will also be permanently deleted."
                />
              )}
            </div>
          ))}

          {allHabits.length === 0 && (
            <p className="text-on-surface-variant text-center" style={{ margin: '16px 0' }}>No habits registered. Create one above!</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={onClose}
            className="primary-btn"
            style={{ backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none', padding: '8px 24px', borderRadius: '8px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
