'use client';

import { useState } from 'react';
import { Plus, Calendar, Clock, X, Dumbbell, Flame, Compass, Activity, Sparkles, MessageSquare, TrendingUp } from 'lucide-react';
import { addFitnessLog, deleteFitnessLog } from '@/actions/fitness';
import DeleteConfirmButton from '@/components/layout/DeleteConfirmButton';
import { useToast } from '@/context/ToastContext';
import { FitnessLog } from '@prisma/client';

export default function FitnessDashboard({ initialLogs }: { initialLogs: FitnessLog[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Form states
  const [activity, setActivity] = useState('Gym');
  const [duration, setDuration] = useState('30');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Summary logic (this week - starting Monday)
  const getMondayOfCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const monday = getMondayOfCurrentWeek();
  const weekLogs = initialLogs.filter(log => new Date(log.date) >= monday);
  const totalMinutes = weekLogs.reduce((sum, log) => sum + log.duration, 0);
  const workoutCount = weekLogs.length;
  const totalDistance = weekLogs.reduce((sum, log) => sum + (log.distance ? Number(log.distance) : 0), 0);

  const openModal = () => {
    setActivity('Gym');
    setDuration('30');
    setDistance('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const durNum = parseInt(duration, 10);
    if (isNaN(durNum) || durNum <= 0) {
      showToast('Please enter a valid duration.', 'error');
      return;
    }
    const distNum = distance.trim() ? parseFloat(distance) : null;
    if (distNum !== null && (isNaN(distNum) || distNum < 0)) {
      showToast('Please enter a valid distance.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await addFitnessLog(
        activity,
        durNum,
        distNum,
        notes.trim() || null,
        new Date(date)
      );
      setCurrentPage(1); // Reset page on add
      closeModal();
    } catch (error) {
      console.error(error);
      showToast('Failed to log fitness activity.', 'error');
    } finally {
      setSubmitting(false);
    }
  };



  // Pagination Logic
  const PAGE_SIZE = 25;
  const totalPages = Math.ceil(initialLogs.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedLogs = initialLogs.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  // Icon mapping helper
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Running':
        return <Flame size={20} color="var(--c-primary)" />;
      case 'Gym':
        return <Dumbbell size={20} color="var(--c-primary)" />;
      case 'Walking':
        return <Compass size={20} color="var(--c-primary)" />;
      case 'Cycling':
        return <TrendingUp size={20} color="var(--c-primary)" />;
      case 'Yoga':
        return <Activity size={20} color="var(--c-primary)" />;
      default:
        return <Sparkles size={20} color="var(--c-primary)" />;
    }
  };

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--c-primary-container)', color: 'var(--c-primary)', borderRadius: '16px', display: 'flex' }}>
            <Clock size={32} />
          </div>
          <div>
            <span className="text-label-md text-on-surface-variant">Active Minutes This Week</span>
            <h3 className="text-display-sm" style={{ margin: 0, fontWeight: 700, color: 'var(--c-primary)' }}>{totalMinutes} mins</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--c-secondary-container)', color: 'var(--c-secondary)', borderRadius: '16px', display: 'flex' }}>
            <Dumbbell size={32} />
          </div>
          <div>
            <span className="text-label-md text-on-surface-variant">Workouts Completed</span>
            <h3 className="text-display-sm" style={{ margin: 0, fontWeight: 700, color: 'var(--c-secondary)' }}>{workoutCount}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--c-tertiary-container)', color: 'var(--c-tertiary)', borderRadius: '16px', display: 'flex' }}>
            <Compass size={32} />
          </div>
          <div>
            <span className="text-label-md text-on-surface-variant">Distance Covered</span>
            <h3 className="text-display-sm" style={{ margin: 0, fontWeight: 700, color: 'var(--c-tertiary)' }}>{totalDistance.toFixed(2)} km</h3>
          </div>
        </div>
      </div>

      {/* Toolbar / Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 className="text-title-lg" style={{ margin: 0, fontWeight: 700 }}>Activity History</h3>
        <button onClick={openModal} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
          <Plus size={18} /> Log Workout
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {paginatedLogs.map(log => {
          const logDate = new Date(log.date);
          const dateString = logDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
          const distanceVal = log.distance ? Number(log.distance) : null;

          return (
            <div key={log.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--c-surface-container-high)', borderRadius: '12px', display: 'flex' }}>
                  {getActivityIcon(log.activity)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span className="text-title-md" style={{ fontWeight: 700, color: 'var(--c-on-surface)' }}>{log.activity}</span>
                    <span className="text-label-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--c-on-surface-variant)', backgroundColor: 'var(--c-surface-container-highest)', padding: '2px 8px', borderRadius: '4px' }}>
                      <Clock size={12} /> {log.duration} mins
                    </span>
                    {distanceVal !== null && (
                      <span className="text-label-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--c-on-surface-variant)', backgroundColor: 'var(--c-surface-container-highest)', padding: '2px 8px', borderRadius: '4px' }}>
                        <Compass size={12} /> {distanceVal.toFixed(2)} km
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm text-on-surface-variant" style={{ margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    {dateString}
                  </p>
                  {log.notes && (
                    <p className="text-body-md text-on-surface-variant" style={{ margin: '8px 0 0 0', display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.4 }}>
                      <MessageSquare size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                      {log.notes}
                    </p>
                  )}
                </div>
              </div>

              <DeleteConfirmButton 
                action={async () => {
                  await deleteFitnessLog(log.id);
                  setCurrentPage(1);
                }}
                iconSize={18}
                title="Delete Activity"
                message="Are you sure you want to delete this activity log?"
              />
            </div>
          );
        })}

        {initialLogs.length === 0 && (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <p className="text-on-surface-variant" style={{ margin: 0 }}>No workouts logged yet. Log your first workout to get started!</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
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

      {/* Log Workout Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
            <button 
              onClick={closeModal} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}
            >
              <X size={20} />
            </button>

            <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>Log Fitness Activity</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-md" style={{ fontWeight: 600 }}>Activity Type</label>
                <select 
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '8px' }}
                  required
                >
                  <option value="Gym">Gym / Workout</option>
                  <option value="Running">Running</option>
                  <option value="Walking">Walking</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="text-label-md" style={{ fontWeight: 600 }}>Duration (mins)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', borderRadius: '8px' }}
                    min="1"
                    required
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="text-label-md" style={{ fontWeight: 600 }}>Distance (km - optional)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5.2"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', borderRadius: '8px' }}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-md" style={{ fontWeight: 600 }}>Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '8px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-label-md" style={{ fontWeight: 600 }}>Notes / Context</label>
                <textarea 
                  placeholder="How did it go? (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', minHeight: '80px', borderRadius: '8px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="primary-btn" 
                  style={{ backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
