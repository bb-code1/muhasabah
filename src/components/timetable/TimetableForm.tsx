'use client';

import { useState } from 'react';
import { updateTimeTable } from '@/actions/timetable';
import { useToast } from '@/context/ToastContext';

interface TimetableFormProps {
  initialData: {
    wakeUpTime: string;
    tillSunrise: string;
    sunriseTillOffice: string;
    officeDeparture: string;
    officeReturn: string;
    gymMorningPreference: string;
    gymEveningPreference: string;
    maghribToIsha: string;
    ishaToHifz: string;
    sleepTime: string;
  };
}

export default function TimetableForm({ initialData }: TimetableFormProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateTimeTable(formData);
      if (res.success) {
        showToast(res.success, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="grid-container">
        
        {/* Left Column: Timings */}
        <div className="card col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="text-title-md" style={{ margin: 0, fontWeight: 700, color: 'var(--c-primary)' }}>Daily Timings</h3>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="text-label-md" style={{ fontWeight: 600 }}>1. Wake Up Time</label>
              <input
                type="time"
                name="wakeUpTime"
                defaultValue={initialData.wakeUpTime}
                className="search-input"
                style={{ borderRadius: '8px' }}
                required
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="text-label-md" style={{ fontWeight: 600 }}>9. Sleep Time</label>
              <input
                type="time"
                name="sleepTime"
                defaultValue={initialData.sleepTime}
                className="search-input"
                style={{ borderRadius: '8px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="text-label-md" style={{ fontWeight: 600 }}>Leave for Office</label>
              <input
                type="time"
                name="officeDeparture"
                defaultValue={initialData.officeDeparture}
                className="search-input"
                style={{ borderRadius: '8px' }}
                required
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="text-label-md" style={{ fontWeight: 600 }}>4. Come back from Office</label>
              <input
                type="time"
                name="officeReturn"
                defaultValue={initialData.officeReturn}
                className="search-input"
                style={{ borderRadius: '8px' }}
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column: Gym Preferences */}
        <div className="card col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="text-title-md" style={{ margin: 0, fontWeight: 700, color: 'var(--c-primary)' }}>Gym Preferences</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 600 }}>5. Morning Gym Timing</label>
            <select
              name="gymMorningPreference"
              defaultValue={initialData.gymMorningPreference}
              className="search-input"
              style={{ borderRadius: '8px', padding: '14px 20px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}
            >
              <option value="NONE">No Gym in Morning</option>
              <option value="AFTER_FAJR">Right after Fajr</option>
              <option value="BEFORE_OFFICE">Before leaving office</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 600 }}>6. Evening Gym Timing</label>
            <select
              name="gymEveningPreference"
              defaultValue={initialData.gymEveningPreference}
              className="search-input"
              style={{ borderRadius: '8px', padding: '14px 20px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}
            >
              <option value="NONE">No Gym in Evening</option>
              <option value="MAGHRIB_TO_ISHA">From Maghrib to Isha</option>
              <option value="AFTER_ISHA">After Isha</option>
            </select>
          </div>
        </div>

        {/* Full Width Blocks for Task Segments */}
        <div className="card col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 className="text-title-md" style={{ margin: 0, fontWeight: 700, color: 'var(--c-primary)' }}>Routine Activities</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 600 }}>2. What to do till Sunrise</label>
            <textarea
              name="tillSunrise"
              defaultValue={initialData.tillSunrise}
              className="search-input"
              style={{ borderRadius: '8px', minHeight: '80px', resize: 'vertical' }}
              placeholder="e.g., Quran recitation, Morning Adhkar, Fajr Prayer..."
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 600 }}>3. What to do from Sunrise till leaving Office</label>
            <textarea
              name="sunriseTillOffice"
              defaultValue={initialData.sunriseTillOffice}
              className="search-input"
              style={{ borderRadius: '8px', minHeight: '80px', resize: 'vertical' }}
              placeholder="e.g., Reading, Quran memorization, breakfast, getting ready..."
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 600 }}>7. What to do from Maghrib to Isha</label>
            <textarea
              name="maghribToIsha"
              defaultValue={initialData.maghribToIsha}
              className="search-input"
              style={{ borderRadius: '8px', minHeight: '80px', resize: 'vertical' }}
              placeholder="e.g., Recitation, family discussion, review of tasks..."
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-label-md" style={{ fontWeight: 600 }}>8. What to do from Isha till Quran Hifz Class</label>
            <textarea
              name="ishaToHifz"
              defaultValue={initialData.ishaToHifz}
              className="search-input"
              style={{ borderRadius: '8px', minHeight: '80px', resize: 'vertical' }}
              placeholder="e.g., Dinner, revising Quran portions, Hifz class preparation..."
              required
            />
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button type="submit" className="primary-btn" disabled={loading} style={{ padding: '12px 32px' }}>
          {loading ? 'Saving...' : 'Save Time Table'}
        </button>
      </div>
    </form>
  );
}
