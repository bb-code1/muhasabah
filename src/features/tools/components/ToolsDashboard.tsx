'use client';

import { useState } from 'react';
import { FocusSession } from '@prisma/client';
import { Wrench, Timer, PlusCircle } from 'lucide-react';
import PomodoroTimer from './PomodoroTimer';
import FocusHistoryTable from './FocusHistoryTable';

interface ToolsDashboardProps {
  initialSessions: FocusSession[];
}

export default function ToolsDashboard({ initialSessions }: ToolsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pomodoro' | string>('pomodoro');
  const [sessions, setSessions] = useState<FocusSession[]>(initialSessions);

  const handleNewSessionCompleted = (newSession: FocusSession) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      
      {/* Tools Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: 'var(--c-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <Wrench size={24} />
            </div>
            <div>
              <h1 className="text-headline-md text-primary" style={{ margin: 0, fontWeight: 800 }}>Tools Hub</h1>
              <p className="text-body-md text-on-surface-variant" style={{ margin: 0 }}>
                Utility tools and focus productivity helpers
              </p>
            </div>
          </div>
        </div>

        {/* Future Extensibility Hint */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: 'var(--c-surface-container-low)',
          border: '1px solid var(--c-outline-variant)',
          fontSize: '12px',
          color: 'var(--c-on-surface-variant)',
          fontWeight: 600
        }}>
          <PlusCircle size={15} style={{ color: 'var(--c-primary)' }} />
          <span>More tools can be added here anytime</span>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--c-outline-variant)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('pomodoro')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'pomodoro' ? 'var(--c-primary)' : 'var(--c-surface-container-high)',
            color: activeTab === 'pomodoro' ? '#ffffff' : 'var(--c-on-surface)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Timer size={18} />
          <span>Pomodoro Focus Timer</span>
        </button>
      </div>

      {/* Main Tool Content */}
      {activeTab === 'pomodoro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Timer Component */}
          <PomodoroTimer onSessionComplete={handleNewSessionCompleted} />

          {/* Focus Session History & Filters */}
          <FocusHistoryTable initialSessions={sessions} />
        </div>
      )}
    </div>
  );
}
