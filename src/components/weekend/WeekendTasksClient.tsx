'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { addWeekendTask, deleteWeekendTask, toggleWeekendTask } from '@/actions/tasks';
import { WeekendTask, WeekendTaskLog } from '@prisma/client';

type TaskWithLogs = WeekendTask & { logs: WeekendTaskLog[] };

function getMonday(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

// Generate the last 12 weeks (Mondays)
function generatePastWeeks(count: number) {
  const weeks = [];
  const currentMonday = getMonday(new Date());
  
  for (let i = 0; i < count; i++) {
    const w = new Date(currentMonday);
    w.setDate(currentMonday.getDate() - (i * 7));
    weeks.push(w);
  }
  return weeks;
}

export default function WeekendTasksClient({ initialTasks }: { initialTasks: TaskWithLogs[] }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  
  const weeks = generatePastWeeks(12); // Show last 12 weeks

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setLoading(true);
    try {
      await addWeekendTask(newTaskTitle);
      setNewTaskTitle('');
    } catch (error) {
      console.error(error);
      alert('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to permanently delete this task?')) {
      await deleteWeekendTask(id);
    }
  };

  const handleToggle = async (id: number, currentCompletedState: boolean, weekStartDateStr: string) => {
    await toggleWeekendTask(id, !currentCompletedState, weekStartDateStr);
  };

  return (
    <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
      
      {/* ADD TASK FORM */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '24px', minWidth: '800px' }}>
        <input 
          type="text" 
          placeholder="Add a new weekend task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="search-input"
          style={{ flex: 1, borderRadius: '8px' }}
          required
        />
        <button type="submit" className="primary-btn" disabled={loading} style={{ padding: '0 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      {/* 2D TASK TABLE */}
      <div style={{ minWidth: '800px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px', borderBottom: '2px solid var(--c-outline-variant)', textAlign: 'left', minWidth: '150px' }}>Week Of</th>
              {initialTasks.map(task => (
                <th key={task.id} style={{ padding: '16px', borderBottom: '2px solid var(--c-outline-variant)', minWidth: '120px', verticalAlign: 'bottom' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{task.title}</span>
                    <button onClick={() => handleDelete(task.id)} style={{ color: 'var(--c-error)', opacity: 0.5, padding: '4px' }} title="Delete Task">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, idx) => {
              const weekDateStr = week.toISOString().split('T')[0];
              const weekLabel = week.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <tr key={weekDateStr} style={{ backgroundColor: idx === 0 ? 'var(--c-surface-container-high)' : 'transparent', borderBottom: '1px solid var(--c-outline-variant)' }}>
                  <td style={{ padding: '16px', textAlign: 'left', fontWeight: idx === 0 ? '700' : '500' }}>
                    {idx === 0 ? `Current Week (${weekLabel})` : weekLabel}
                  </td>
                  
                  {initialTasks.map(task => {
                    const isCompleted = task.logs.some(log => {
                      const logWeekStr = new Date(log.weekStartDate).toISOString().split('T')[0];
                      return logWeekStr === weekDateStr;
                    });
                    
                    return (
                      <td key={task.id} style={{ padding: '16px' }}>
                        <input 
                          type="checkbox" 
                          checked={isCompleted}
                          onChange={() => handleToggle(task.id, isCompleted, weekDateStr)}
                          className="habit-checkbox"
                          style={{ margin: '0 auto', appearance: 'auto', width: '24px', height: '24px', cursor: 'pointer', accentColor: 'var(--c-primary)' }}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
