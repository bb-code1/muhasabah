'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleDailyTask, deleteDailyTask } from '@/actions/index';
import { Calendar, Clock, Sparkles, Inbox, Plus, Trash2, CalendarDays } from 'lucide-react';
import DeleteConfirmButton from '@/components/ui/DeleteConfirmButton';
import { useToast } from '@/context/ToastContext';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  targetDate: Date | string | null;
  category: string;
}

interface FlexibleTasksDashboardProps {
  initialTasks: Task[];
}

export default function FlexibleTasksDashboard({ initialTasks }: FlexibleTasksDashboardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [taskCategory, setTaskCategory] = useState<string>('UNDATED');
  const [customDate, setCustomDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Group tasks
  const upcomingTasks = initialTasks.filter(t => t.category === 'UPCOMING' || (t.targetDate && new Date(t.targetDate) > new Date(new Date().setDate(new Date().getDate() + 1))));
  const laterTasks = initialTasks.filter(t => t.category === 'LATER');
  const somedayTasks = initialTasks.filter(t => t.category === 'SOMEDAY');
  const undatedTasks = initialTasks.filter(t => (t.category === 'UNDATED' || !t.category) && !t.targetDate);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Set actual category and date parameters
    if (taskCategory === 'CUSTOM') {
      formData.set('category', 'UPCOMING');
      formData.set('date', customDate);
    } else {
      formData.set('category', taskCategory);
      formData.set('date', '');
    }

    try {
      const { addDailyTask } = await import('@/actions');
      await addDailyTask(formData);
      showToast('Task added successfully.', 'success');
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
      setTaskCategory('UNDATED');
      setCustomDate('');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add task.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      await toggleDailyTask(id, completed);
      showToast(completed ? 'Task marked incomplete.' : 'Task completed!', 'success');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task.';
      showToast(msg, 'error');
    }
  };

  const renderTaskList = (tasks: Task[], emptyMessage: string) => {
    if (tasks.length === 0) {
      return <p style={{ margin: 0, fontSize: '13px', color: 'var(--c-on-surface-variant)', opacity: 0.8, padding: '12px' }}>{emptyMessage}</p>;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.map(task => {
          const deleteAction = async () => {
            try {
              await deleteDailyTask(task.id);
              showToast('Task deleted successfully.', 'success');
              router.refresh();
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Failed to delete task.';
              showToast(msg, 'error');
            }
          };

          const displayDateStr = task.targetDate 
            ? new Date(task.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : null;

          return (
            <div 
              key={task.id} 
              style={{ 
                backgroundColor: 'var(--c-surface-container-low)', 
                padding: '12px 14px', 
                borderRadius: '10px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                border: '1px solid var(--c-outline-variant)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <button 
                  type="button" 
                  onClick={() => handleToggle(task.id, task.isCompleted)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexShrink: 0
                  }}
                  className={`habit-checkbox ${task.isCompleted ? 'checked' : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span 
                    style={{ 
                      fontSize: '13.5px',
                      fontWeight: 500, 
                      textDecoration: task.isCompleted ? 'line-through' : 'none', 
                      opacity: task.isCompleted ? 0.6 : 1,
                      color: 'var(--c-on-surface)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {task.title}
                  </span>
                  {displayDateStr && (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--c-primary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <CalendarDays size={10} />
                      {displayDateStr}
                    </span>
                  )}
                </div>
              </div>
              
              <DeleteConfirmButton 
                action={deleteAction} 
                iconSize={16} 
                title="Delete Task"
                message={`Are you sure you want to delete "${task.title}"?`}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Add Task Form Card */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 className="text-title-md" style={{ margin: '0 0 16px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)' }}>
          <Plus size={18} />
          Create Flexible Task
        </h3>
        
        <form onSubmit={handleAddTask} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Description</label>
            <input 
              type="text" 
              name="title" 
              placeholder="What needs to be scheduled?" 
              className="search-input"
              required
              style={{ borderRadius: '8px', width: '100%' }}
            />
          </div>

          <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeframe / Schedule</label>
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="search-input"
              style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13.5px', padding: '9px 12px', backgroundColor: 'var(--c-surface-container-high)', border: '1px solid var(--c-outline-variant)' }}
            >
              <option value="TODAY">📅 Today</option>
              <option value="TOMORROW">🌅 Tomorrow</option>
              <option value="UPCOMING">📅 Upcoming</option>
              <option value="LATER">⏰ Later</option>
              <option value="SOMEDAY">🌟 Someday</option>
              <option value="UNDATED">📥 No Specific Date (Undated)</option>
              <option value="CUSTOM">🗓️ Custom Date...</option>
            </select>
          </div>

          {taskCategory === 'CUSTOM' && (
            <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Date</label>
              <input 
                type="date" 
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                required
                className="search-input"
                style={{ borderRadius: '8px', padding: '7.5px 12px' }}
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="primary-btn" style={{ padding: '10.5px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>{loading ? 'Adding...' : 'Create'}</span>
          </button>
        </form>
      </div>

      {/* Grid displaying the 4 Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        
        {/* Upcoming Section */}
        <div className="card" style={{ padding: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="text-title-sm" style={{ margin: '0 0 16px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
            <Calendar size={18} />
            Upcoming Tasks ({upcomingTasks.length})
          </h4>
          <div style={{ flex: 1 }}>
            {renderTaskList(upcomingTasks, 'No upcoming tasks scheduled.')}
          </div>
        </div>

        {/* Later Section */}
        <div className="card" style={{ padding: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="text-title-sm" style={{ margin: '0 0 16px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1' }}>
            <Clock size={18} />
            Later ({laterTasks.length})
          </h4>
          <div style={{ flex: 1 }}>
            {renderTaskList(laterTasks, 'No tasks deferred for later.')}
          </div>
        </div>

        {/* Someday Section */}
        <div className="card" style={{ padding: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="text-title-sm" style={{ margin: '0 0 16px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7' }}>
            <Sparkles size={18} />
            Someday ({somedayTasks.length})
          </h4>
          <div style={{ flex: 1 }}>
            {renderTaskList(somedayTasks, 'No backlog tasks for someday.')}
          </div>
        </div>

        {/* Undated Section */}
        <div className="card" style={{ padding: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="text-title-sm" style={{ margin: '0 0 16px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)' }}>
            <Inbox size={18} />
            Undated (No Specific Date) ({undatedTasks.length})
          </h4>
          <div style={{ flex: 1 }}>
            {renderTaskList(undatedTasks, 'No undated tasks.')}
          </div>
        </div>

      </div>

    </div>
  );
}
