'use client';

import { useState } from 'react';
import { Plus, List, Calendar, CalendarHeart } from 'lucide-react';
import { addWeekendTask, deleteWeekendTask, toggleWeekendTask } from '@/actions/tasks';
import DeleteConfirmButton from '@/components/layout/DeleteConfirmButton';
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
  const [view, setView] = useState<'table' | 'manage'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  
  const weeks = generatePastWeeks(12); // Show last 12 weeks

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setLoading(true);
    try {
      await addWeekendTask(newTaskTitle);
      setNewTaskTitle('');
      setCurrentPage(1); // Reset page on add
    } catch (error) {
      console.error(error);
      alert('Failed to add task');
    } finally {
      setLoading(false);
    }
  };



  const handleToggle = async (id: number, currentCompletedState: boolean, weekStartDateStr: string) => {
    await toggleWeekendTask(id, !currentCompletedState, weekStartDateStr);
  };

  const handleViewChange = (newView: 'table' | 'manage') => {
    setView(newView);
    setCurrentPage(1); // Reset page when view switches
  };

  // Pagination Logic for Manage View Task List
  const PAGE_SIZE = 25;
  const totalPages = Math.ceil(initialTasks.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedTasks = initialTasks.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  return (
    <div>
      {/* PAGE HEADER (Always visible, stays fixed at the top) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarHeart color="var(--c-primary)" size={28} />
          <h2 className="text-headline-md" style={{ margin: 0 }}>Weekend Tasks</h2>
        </div>

        {view === 'table' ? (
          <button 
            onClick={() => handleViewChange('manage')} 
            className="primary-btn" 
          >
            <List size={18} /> Manage Tasks
          </button>
        ) : (
          <button 
            onClick={() => handleViewChange('table')} 
            className="primary-btn" 
          >
            <Calendar size={18} /> View History Table
          </button>
        )}
      </div>

      <p className="text-body-md text-on-surface-variant mb-24">
        {view === 'table' 
          ? 'Track your recurring weekend tasks historically. Check off tasks for the current week at the top, and see your progress over the past weeks below.'
          : 'Add new recurring weekend tasks or delete existing ones from your schedule.'
        }
      </p>

      {view === 'manage' ? (
        /* MANAGE TASKS CARD */
        <div className="card" style={{ padding: '24px' }}>
          <h3 className="text-title-md" style={{ margin: '0 0 20px 0', fontWeight: 600 }}>Manage Weekend Tasks</h3>

          {/* ADD TASK FORM */}
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
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

          {/* VERTICAL LIST FOR MANAGING */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {paginatedTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--c-surface-container-low)', borderRadius: '8px', border: '1px solid var(--c-outline-variant)' }}>
                <span className="text-body-md" style={{ fontWeight: 500, color: 'var(--c-on-surface)' }}>
                  {task.title}
                </span>
                <DeleteConfirmButton 
                  action={async () => {
                    await deleteWeekendTask(task.id);
                    setCurrentPage(1);
                  }}
                  iconSize={18}
                  title="Delete Task"
                  message="Are you sure you want to permanently delete this weekend task?"
                  style={{ padding: '8px' }}
                />
              </div>
            ))}
            {paginatedTasks.length === 0 && (
              <p className="text-on-surface-variant" style={{ textAlign: 'center', padding: '24px' }}>No tasks found. Add a task above.</p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button 
                  disabled={activePage <= 1}
                  onClick={() => setCurrentPage(activePage - 1)}
                  className="primary-btn" 
                  style={{ padding: '8px 16px', backgroundColor: activePage <= 1 ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage <= 1 ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage <= 1 ? 0.5 : 1, cursor: activePage <= 1 ? 'not-allowed' : 'pointer', boxShadow: 'none' }}
                >
                  Previous
                </button>
                
                <span className="text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>
                  Page {activePage} of {totalPages}
                </span>

                <button 
                  disabled={activePage >= totalPages}
                  onClick={() => setCurrentPage(activePage + 1)}
                  className="primary-btn" 
                  style={{ padding: '8px 16px', backgroundColor: activePage >= totalPages ? 'var(--c-surface-container-lowest)' : 'var(--c-surface-container-high)', color: activePage >= totalPages ? 'var(--c-on-surface-variant)' : 'var(--c-on-surface)', opacity: activePage >= totalPages ? 0.5 : 1, cursor: activePage >= totalPages ? 'not-allowed' : 'pointer', boxShadow: 'none' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 2D HISTORY TABLE CARD */
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ overflowX: 'auto', transform: 'rotateX(180deg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px', transform: 'rotateX(180deg)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', borderBottom: '2px solid var(--c-outline-variant)', textAlign: 'left', minWidth: '150px' }}>Week Of</th>
                  {initialTasks.map(task => (
                    <th key={task.id} style={{ padding: '16px', borderBottom: '2px solid var(--c-outline-variant)', minWidth: '120px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>{task.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, idx) => {
                  const weekDateStr = week.toISOString().split('T')[0];
                  const endDate = new Date(week);
                  endDate.setDate(week.getDate() + 6);
                  
                  const startLabel = week.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const endLabel = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const weekLabel = `From ${startLabel} - To ${endLabel}`;
                  
                  const isCurrentWeek = idx === 0;
                  
                  return (
                    <tr key={weekDateStr} style={{ backgroundColor: isCurrentWeek ? 'var(--c-surface-container-high)' : 'transparent', borderBottom: '1px solid var(--c-outline-variant)' }}>
                      <td style={{ padding: '16px', textAlign: 'left', fontWeight: isCurrentWeek ? '700' : '500' }}>
                        {isCurrentWeek ? `Current Week (${weekLabel})` : weekLabel}
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
                              readOnly
                              onClick={(e) => {
                                if (!isCurrentWeek) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={() => {
                                if (isCurrentWeek) {
                                  handleToggle(task.id, isCompleted, weekDateStr);
                                }
                              }}
                              className="habit-checkbox"
                              style={{ 
                                margin: '0 auto', 
                                appearance: 'auto', 
                                width: '24px', 
                                height: '24px', 
                                cursor: isCurrentWeek ? 'pointer' : 'default', 
                                accentColor: isCurrentWeek ? 'var(--c-primary)' : 'var(--c-outline)', 
                                opacity: 1 
                              }}
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
      )}
    </div>
  );
}
