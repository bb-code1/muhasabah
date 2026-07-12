'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarRange, Check, Calendar, Trash2, Plus } from 'lucide-react';
import { addRecurringTracker, updateRecurringLastDone, deleteRecurringTracker } from '@/actions/tasks';
import DeleteConfirmButton from '@/components/layout/DeleteConfirmButton';
import { useToast } from '@/context/ToastContext';

interface RecurringTracker {
  id: number;
  title: string;
  lastDone: Date | null;
  createdAt: Date;
}

export default function RecurringTrackers({ initialTrackers }: { initialTrackers: RecurringTracker[] }) {
  const [newTitle, setNewTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    startTransition(async () => {
      try {
        await addRecurringTracker(newTitle);
        setNewTitle('');
        showToast('Tracker added successfully!', 'success');
        router.refresh();
      } catch (error) {
        console.error(error);
        showToast('Failed to add tracker.', 'error');
      }
    });
  };

  const handleMarkDoneToday = async (id: number, title: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    startTransition(async () => {
      try {
        await updateRecurringLastDone(id, todayStr);
        showToast(`Marked "${title}" as completed today!`, 'success');
        router.refresh();
      } catch (error) {
        console.error(error);
        showToast('Failed to update tracker.', 'error');
      }
    });
  };

  const handleDateChange = async (id: number, title: string, dateStr: string) => {
    startTransition(async () => {
      try {
        await updateRecurringLastDone(id, dateStr || null);
        showToast(`Updated completed date for "${title}".`, 'success');
        router.refresh();
      } catch (error) {
        console.error(error);
        showToast('Failed to update date.', 'error');
      }
    });
  };

  const handleDelete = async (id: number, title: string) => {
    startTransition(async () => {
      try {
        await deleteRecurringTracker(id);
        showToast(`Deleted tracker "${title}".`, 'success');
        router.refresh();
      } catch (error) {
        console.error(error);
        showToast('Failed to delete tracker.', 'error');
      }
    });
  };

  const formatLastDone = (lastDoneDate: Date | null) => {
    if (!lastDoneDate) return 'Never completed';

    const d = new Date(lastDoneDate);
    // Force reset time to local midnight for timezone-safe date diff comparison
    const localD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    
    const now = new Date();
    const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = localToday.getTime() - localD.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1) {
      const formatted = localD.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      return `${diffDays} days ago (${formatted})`;
    }
    return localD.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s' }}>
      <div>
        <h3 className="text-headline-md" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <CalendarRange size={24} style={{ color: 'var(--c-primary)' }} />
          Periodic Tracker (Last Done)
        </h3>
        <p className="text-body-md text-on-surface-variant" style={{ marginTop: '4px' }}>
          Track tasks with infrequent frequencies, such as nail cutting or haircuts.
        </p>
      </div>

      {/* ADD NEW TRACKER FORM */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="Add new recurring tracker (e.g. Nails Cutting)..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="search-input"
          required
          style={{ flex: 1, borderRadius: '8px' }}
        />
        <button type="submit" className="primary-btn" style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      {/* TRACKERS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {initialTrackers.map(tracker => {
          const formattedDate = tracker.lastDone 
            ? new Date(tracker.lastDone).toISOString().split('T')[0] 
            : '';

          return (
            <div 
              key={tracker.id} 
              className="habit-item" 
              style={{ 
                backgroundColor: 'var(--c-surface-container-low)', 
                padding: '16px 20px', 
                borderRadius: '12px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                border: '1px solid var(--c-outline-variant)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="text-body-lg" style={{ fontWeight: 700, color: 'var(--c-on-surface)' }}>
                  {tracker.title}
                </span>
                <span className="text-label-md" style={{ color: tracker.lastDone ? 'var(--c-primary)' : 'var(--c-on-surface-variant)', fontWeight: 600 }}>
                  Last Done: {formatLastDone(tracker.lastDone)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {/* Done Today button */}
                <button 
                  onClick={() => handleMarkDoneToday(tracker.id, tracker.title)}
                  className="primary-btn"
                  style={{ 
                    padding: '6px 14px', 
                    borderRadius: '24px', 
                    fontSize: '13px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    backgroundColor: 'var(--c-surface-container-high)',
                    color: 'var(--c-on-surface)',
                    border: '1px solid var(--c-outline-variant)',
                    boxShadow: 'none',
                    backgroundImage: 'none'
                  }}
                  title="Mark done today"
                >
                  <Check size={14} style={{ color: 'var(--c-primary)' }} />
                  Done Today
                </button>

                {/* Date Input to set custom date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                  <Calendar size={16} className="text-on-surface-variant" />
                  <input 
                    type="date" 
                    value={formattedDate}
                    onChange={(e) => handleDateChange(tracker.id, tracker.title, e.target.value)}
                    className="search-input"
                    style={{ 
                      borderRadius: '8px', 
                      padding: '4px 10px', 
                      fontSize: '13px', 
                      width: '135px',
                      backgroundColor: 'var(--c-surface)',
                      border: '1px solid var(--c-outline-variant)'
                    }}
                  />
                </div>

                {/* Delete button confirmation wrapper */}
                <DeleteConfirmButton 
                  action={() => handleDelete(tracker.id, tracker.title)} 
                  iconSize={18} 
                  title="Delete Tracker"
                  message={`Are you sure you want to delete the tracker "${tracker.title}"?`}
                />
              </div>
            </div>
          );
        })}

        {initialTrackers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--c-on-surface-variant)', border: '1px dashed var(--c-outline-variant)', borderRadius: '8px' }}>
            No periodic trackers added yet.
          </div>
        )}
      </div>
    </div>
  );
}
