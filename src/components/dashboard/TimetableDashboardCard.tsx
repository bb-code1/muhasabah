'use client';

import { useState, useEffect } from 'react';
import { 
  Sun, Sunrise, Briefcase, Dumbbell, BookOpen, Moon, Clock, Play, CheckCircle
} from 'lucide-react';

interface TimetableData {
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
}

export default function TimetableDashboardCard({ timetable }: { timetable: TimetableData }) {
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // helper to compare HH:MM times
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Build the timeline array dynamically based on preferences
  const timelineItems = [];

  // 1. Wake Up
  timelineItems.push({
    time: timetable.wakeUpTime,
    title: 'Wake Up',
    desc: 'Start of the day',
    icon: <Sun size={18} color="var(--c-primary)" />,
  });

  // 2. Till Sunrise
  timelineItems.push({
    time: timetable.wakeUpTime, // starts at wake up
    title: 'Till Sunrise Routine',
    desc: timetable.tillSunrise,
    icon: <Sunrise size={18} color="var(--c-primary)" />,
  });

  // 2.1 Gym right after Fajr (Morning Gym Preference = AFTER_FAJR)
  if (timetable.gymMorningPreference === 'AFTER_FAJR') {
    timelineItems.push({
      time: '',
      title: 'Gym Session',
      desc: 'Workout right after Fajr prayer.',
      icon: <Dumbbell size={18} color="#e11d48" />,
      isGym: true
    });
  }

  // 3. Sunrise till Office Departure
  timelineItems.push({
    time: 'Sunrise',
    title: 'Morning Spiritual & Knowledge Segments',
    desc: timetable.sunriseTillOffice,
    icon: <BookOpen size={18} color="var(--c-primary)" />,
  });

  // 3.1 Gym before office (Morning Gym Preference = BEFORE_OFFICE)
  if (timetable.gymMorningPreference === 'BEFORE_OFFICE') {
    timelineItems.push({
      time: '',
      title: 'Gym Session',
      desc: 'Workout before leaving for office.',
      icon: <Dumbbell size={18} color="#e11d48" />,
      isGym: true
    });
  }

  // 4. Office Departure
  timelineItems.push({
    time: timetable.officeDeparture,
    title: 'Leave for Office',
    desc: 'Depart for work.',
    icon: <Briefcase size={18} color="var(--c-primary)" />,
  });

  // 5. Office Hours (Departure to Return)
  timelineItems.push({
    time: `${timetable.officeDeparture} - ${timetable.officeReturn}`,
    title: 'Office Hours',
    desc: 'Professional work commitments.',
    icon: <Briefcase size={18} color="var(--c-primary)" />,
  });

  // 6. Office Return
  timelineItems.push({
    time: timetable.officeReturn,
    title: 'Return from Office',
    desc: 'Arrival back home.',
    icon: <Briefcase size={18} color="var(--c-primary)" />,
  });

  // 7. Maghrib to Isha Routine
  timelineItems.push({
    time: 'Maghrib',
    title: 'Maghrib to Isha Segment',
    desc: timetable.maghribToIsha,
    icon: <BookOpen size={18} color="var(--c-primary)" />,
  });

  // 7.1 Gym Maghrib to Isha (Evening Gym Preference = MAGHRIB_TO_ISHA)
  if (timetable.gymEveningPreference === 'MAGHRIB_TO_ISHA') {
    timelineItems.push({
      time: '',
      title: 'Gym Session',
      desc: 'Workout between Maghrib and Isha prayers.',
      icon: <Dumbbell size={18} color="#e11d48" />,
      isGym: true
    });
  }

  // 8. Isha till Quran Hifz Class
  timelineItems.push({
    time: 'Isha',
    title: 'Isha to Hifz Class Routine',
    desc: timetable.ishaToHifz,
    icon: <BookOpen size={18} color="var(--c-primary)" />,
  });

  // 8.1 Gym after Isha (Evening Gym Preference = AFTER_ISHA)
  if (timetable.gymEveningPreference === 'AFTER_ISHA') {
    timelineItems.push({
      time: '',
      title: 'Gym Session',
      desc: 'Workout after Isha prayer.',
      icon: <Dumbbell size={18} color="#e11d48" />,
      isGym: true
    });
  }

  // 9. Sleep Time
  timelineItems.push({
    time: timetable.sleepTime,
    title: 'Sleep',
    desc: 'End of the day routine.',
    icon: <Moon size={18} color="var(--c-primary)" />,
  });

  // Simple active slot matching using static boundaries (approximation)
  const getActiveIndex = () => {
    if (!currentTime) return -1;
    const currentMin = timeToMinutes(currentTime);
    const wakeMin = timeToMinutes(timetable.wakeUpTime);
    const sleepMin = timeToMinutes(timetable.sleepTime);
    const officeDepMin = timeToMinutes(timetable.officeDeparture);
    const officeRetMin = timeToMinutes(timetable.officeReturn);

    // If sleeping
    if (sleepMin > wakeMin) {
      if (currentMin >= sleepMin || currentMin < wakeMin) return timelineItems.length - 1;
    } else {
      if (currentMin >= sleepMin && currentMin < wakeMin) return timelineItems.length - 1;
    }

    // Office hours
    if (currentMin >= officeDepMin && currentMin < officeRetMin) {
      return 5; // Office hours item
    }

    // Wake Up to office departure
    if (currentMin >= wakeMin && currentMin < officeDepMin) {
      // split morning
      const midPoint = wakeMin + (officeDepMin - wakeMin) / 2;
      return currentMin < midPoint ? 1 : 3;
    }

    // Office return to sleep
    if (currentMin >= officeRetMin && currentMin < sleepMin) {
      const midPoint = officeRetMin + (sleepMin - officeRetMin) / 2;
      return currentMin < midPoint ? 8 : 10;
    }

    return -1;
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="card w-full" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="text-title-lg" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-primary)' }}>
          <Clock size={22} />
          Today&apos;s Time Table
        </h2>
        {currentTime && (
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--c-surface-container-low)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--c-outline-variant)' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--c-primary)', borderRadius: '50%', display: 'inline-block' }}></span>
            {currentTime}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
        {timelineItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          
          return (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                gap: '16px', 
                position: 'relative',
                opacity: activeIndex !== -1 && !isActive ? 0.65 : 1,
                transform: isActive ? 'scale(1.01)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Timeline line connector */}
              {idx < timelineItems.length - 1 && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: '17px', 
                    top: '36px', 
                    bottom: '-16px', 
                    width: '2px', 
                    background: isActive ? 'linear-gradient(to bottom, var(--c-primary) 0%, var(--c-outline-variant) 100%)' : 'var(--c-outline-variant)',
                    zIndex: 1 
                  }}
                />
              )}

              {/* Icon / Time indicator */}
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  backgroundColor: isActive ? 'var(--c-primary-container)' : item.isGym ? 'rgba(225, 29, 72, 0.08)' : 'var(--c-surface-container-low)', 
                  border: `1px solid ${isActive ? 'var(--c-primary)' : item.isGym ? 'rgba(225, 29, 72, 0.2)' : 'var(--c-outline-variant)'}`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  zIndex: 2,
                  flexShrink: 0
                }}
              >
                {isActive ? <Play size={16} color="var(--c-primary)" /> : item.icon}
              </div>

              {/* Content box */}
              <div 
                style={{ 
                  flex: 1, 
                  backgroundColor: isActive ? 'var(--c-primary-container)' : 'transparent',
                  padding: isActive ? '12px 16px' : '0px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid var(--c-primary)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                  <h4 
                    style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      fontWeight: 700, 
                      color: item.isGym ? '#e11d48' : isActive ? 'var(--c-primary)' : 'var(--c-on-surface)' 
                    }}
                  >
                    {item.title}
                  </h4>
                  {item.time && (
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        color: isActive ? 'var(--c-primary)' : 'var(--c-on-surface-variant)',
                        backgroundColor: isActive ? 'rgba(191,145,41,0.1)' : 'var(--c-surface-container-low)',
                        padding: '2px 8px',
                        borderRadius: '8px'
                      }}
                    >
                      {item.time}
                    </span>
                  )}
                </div>
                <p 
                  style={{ 
                    margin: 0, 
                    fontSize: '13px', 
                    lineHeight: 1.5,
                    color: isActive ? 'var(--c-on-surface)' : 'var(--c-on-surface-variant)' 
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
