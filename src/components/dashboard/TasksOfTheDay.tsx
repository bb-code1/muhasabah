import { getDailyTasks, addDailyTask, toggleDailyTask, deleteDailyTask } from '@/actions';
import Link from 'next/link';
import DeleteConfirmButton from '@/components/layout/DeleteConfirmButton';

export default async function TasksOfTheDay({ 
  dateStr, 
  hideTitle, 
  readOnly,
  page = 1
}: { 
  dateStr: string, 
  hideTitle?: boolean, 
  readOnly?: boolean,
  page?: number
}) {
  const tasks = await getDailyTasks(dateStr);
  
  const currentDate = new Date(dateStr);
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const displayDate = currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  // Determine if it's "Today", "Tomorrow", or "Yesterday"
  const realToday = new Date().toISOString().split('T')[0];
  const isToday = dateStr === realToday;
  const isTomorrow = dateStr === formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));

  let titleText = "Tasks of the Day";
  if (isToday) titleText = "Today's Tasks";
  if (isTomorrow) titleText = "Tomorrow's Plan";

  // Pagination Logic
  const PAGE_SIZE = 25;
  const totalPages = Math.ceil(tasks.length / PAGE_SIZE) || 1;
  const currentPage = page > totalPages ? totalPages : page;
  const paginatedTasks = tasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!hideTitle && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="text-title-md">{titleText}</h3>
            <p className="text-label-sm text-primary" style={{ textTransform: 'uppercase', fontWeight: 700 }}>{displayDate}</p>
          </div>
        </div>
      )}

      {!readOnly && (
        <form action={addDailyTask} style={{ display: 'flex', gap: '12px' }}>
          <input type="hidden" name="date" value={dateStr} />
          <input 
            type="text" 
            name="title" 
            placeholder="What needs to be done today?" 
            className="search-input"
            required
            style={{ flex: 1, borderRadius: '8px' }}
          />
          <button type="submit" className="primary-btn add-task-btn">
            <span className="material-symbols-outlined add-icon">add</span>
            <span className="add-text-label">Add Task</span>
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {paginatedTasks.map(task => {
          const toggleAction = toggleDailyTask.bind(null, task.id, task.isCompleted);
          const deleteAction = deleteDailyTask.bind(null, task.id);
          
          return (
            <div key={task.id} className="habit-item" style={{ backgroundColor: 'var(--c-surface-container-low)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {readOnly ? (
                  <div className={`habit-checkbox ${task.isCompleted ? 'checked' : ''}`} style={{ cursor: 'default' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                  </div>
                ) : (
                  <form action={toggleAction}>
                    <button type="submit" className={`habit-checkbox ${task.isCompleted ? 'checked' : ''}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                    </button>
                  </form>
                )}
                <span className="text-body-md" style={{ fontWeight: 500, textDecoration: task.isCompleted ? 'line-through' : 'none', opacity: task.isCompleted ? 0.6 : 1 }}>
                  {task.title}
                </span>
              </div>
              {!readOnly && (
                <DeleteConfirmButton 
                  action={deleteAction} 
                  iconSize={18} 
                  title="Delete Task"
                  message={`Are you sure you want to delete "${task.title}"?`}
                />
              )}
            </div>
          );
        })}
        {paginatedTasks.length === 0 && <p className="text-on-surface-variant text-label-sm">No tasks planned for this day.</p>}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
            {currentPage > 1 ? (
              <Link href={`?page=${currentPage - 1}`} className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none' }}>
                Previous
              </Link>
            ) : (
              <button disabled className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-lowest)', color: 'var(--c-on-surface-variant)', opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' }}>
                Previous
              </button>
            )}
            
            <span className="text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link href={`?page=${currentPage + 1}`} className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none' }}>
                Next
              </Link>
            ) : (
              <button disabled className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-lowest)', color: 'var(--c-on-surface-variant)', opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' }}>
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
