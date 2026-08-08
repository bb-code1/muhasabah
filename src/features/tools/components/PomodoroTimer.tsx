'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { addFocusSession } from '@/features/tools/actions';
import { useToast } from '@/context/ToastContext';
import { FocusSession } from '@prisma/client';

interface PomodoroTimerProps {
  onSessionComplete?: (newSession: FocusSession) => void;
}

const PRESET_MINUTES = [15, 25, 45, 60];

// Play completion chime tone using Web Audio API
function playCompletionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Create a pleasant 3-tone harmonic chime (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + idx * 0.15;
      const duration = 0.6;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.error('Audio playback error:', e);
  }
}

export default function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { showToast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetEndTimeRef = useRef<number | null>(null);

  const totalSeconds = selectedMinutes * 60;

  // Handle setting new timer duration when stopped
  const handleSelectMinutes = (mins: number) => {
    if (isRunning) return;
    const validMins = Math.max(1, Math.min(180, mins));
    setSelectedMinutes(validMins);
    setSecondsLeft(validMins * 60);
    targetEndTimeRef.current = null;
  };

  const handleAdjustMinutes = (delta: number) => {
    if (isRunning) return;
    const newMins = Math.max(1, Math.min(180, selectedMinutes + delta));
    handleSelectMinutes(newMins);
  };

  // Complete session & log to DB
  const handleCompleteSession = useCallback(async (completedDurationMinutes: number) => {
    if (isSaving || completedDurationMinutes <= 0) return;
    setIsSaving(true);
    try {
      if (soundEnabled) {
        playCompletionChime();
      }

      const session = await addFocusSession(completedDurationMinutes, label || null);
      showToast(`🎉 Focus session logged! (${completedDurationMinutes} min)`, 'success');
      
      if (onSessionComplete && session) {
        onSessionComplete(session);
      }

      // Reset timer
      targetEndTimeRef.current = null;
      setIsRunning(false);
      setSecondsLeft(selectedMinutes * 60);
    } catch (err) {
      showToast(`Failed to log focus session: ${(err as Error).message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, soundEnabled, label, selectedMinutes, showToast, onSessionComplete]);

  // Recalculate remaining time accurately against wall-clock timestamp
  const updateRemainingTime = useCallback(() => {
    if (!targetEndTimeRef.current) return;
    
    const now = Date.now();
    const remainingMs = targetEndTimeRef.current - now;
    const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

    setSecondsLeft(remainingSecs);

    if (remainingSecs <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      targetEndTimeRef.current = null;
      setIsRunning(false);
      handleCompleteSession(selectedMinutes);
    }
  }, [selectedMinutes, handleCompleteSession]);

  // Timer Tick Interval & Background Tab / Window Visibility Change Sync
  useEffect(() => {
    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + (secondsLeft * 1000);
      }

      updateRemainingTime();

      timerRef.current = setInterval(() => {
        updateRemainingTime();
      }, 500);

      const handleVisibilityOrFocusChange = () => {
        updateRemainingTime();
      };

      document.addEventListener('visibilitychange', handleVisibilityOrFocusChange);
      window.addEventListener('focus', handleVisibilityOrFocusChange);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityOrFocusChange);
        window.removeEventListener('focus', handleVisibilityOrFocusChange);
      };
    } else {
      targetEndTimeRef.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRunning, updateRemainingTime]);

  const toggleStartPause = () => {
    if (!isRunning) {
      let currentSecs = secondsLeft;
      if (currentSecs <= 0) {
        currentSecs = selectedMinutes * 60;
        setSecondsLeft(currentSecs);
      }
      targetEndTimeRef.current = Date.now() + (currentSecs * 1000);
      setIsRunning(true);
    } else {
      targetEndTimeRef.current = null;
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    targetEndTimeRef.current = null;
    setIsRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  };

  const handleFinishEarly = () => {
    const elapsedSeconds = (selectedMinutes * 60) - secondsLeft;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);

    if (elapsedMinutes < 1) {
      showToast('Session too short to log (must be at least 1 minute).', 'error');
      return;
    }

    if (confirm(`Log ${elapsedMinutes} minute(s) of focus time done so far?`)) {
      handleCompleteSession(elapsedMinutes);
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG Progress Ring calculations
  const radius = 110;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div 
      className="card flex-col items-center" 
      style={{ 
        padding: '32px 24px', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(145deg, var(--c-surface-container-lowest), var(--c-surface-container-low))',
        border: '1px solid var(--c-outline-variant)',
        borderRadius: '24px'
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--c-primary)',
            flexShrink: 0
          }}>
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-title-lg" style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>Pomodoro Focus Timer</h2>
            <p className="text-body-sm text-on-surface-variant" style={{ margin: 0, fontSize: '13px' }}>
              Deep focus mode without interruptions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid var(--c-outline-variant)',
            backgroundColor: soundEnabled ? 'var(--c-surface-container-high)' : 'transparent',
            color: soundEnabled ? 'var(--c-primary)' : 'var(--c-on-surface-variant)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s',
            alignSelf: 'flex-start'
          }}
          title={soundEnabled ? 'Chime Enabled' : 'Chime Muted'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundEnabled ? 'Chime On' : 'Muted'}</span>
        </button>
      </div>

      {/* Timer Controls & Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '440px' }}>
        
        {/* Preset Selector */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', opacity: isRunning ? 0.6 : 1, pointerEvents: isRunning ? 'none' : 'auto' }}>
          {PRESET_MINUTES.map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectMinutes(mins)}
              style={{
                flex: '1 1 70px',
                minWidth: '65px',
                padding: '8px 12px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '13px',
                backgroundColor: selectedMinutes === mins ? 'var(--c-primary)' : 'var(--c-surface-container-high)',
                color: selectedMinutes === mins ? 'var(--c-on-primary)' : 'var(--c-on-surface-variant)',
                border: '1px solid var(--c-outline-variant)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              {mins} Mins
            </button>
          ))}
        </div>

        {/* Custom Duration Adjustment (when not running) */}
        {!isRunning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleAdjustMinutes(-5)}
                className="secondary-btn"
                style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '10px', minHeight: '36px' }}
              >
                -5m
              </button>
              <button
                onClick={() => handleAdjustMinutes(-1)}
                className="secondary-btn"
                style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '10px', minHeight: '36px' }}
              >
                -1m
              </button>
            </div>
            
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--c-on-surface)', minWidth: '70px', textAlign: 'center', padding: '4px 0' }}>
              {selectedMinutes} mins
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleAdjustMinutes(1)}
                className="secondary-btn"
                style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '10px', minHeight: '36px' }}
              >
                +1m
              </button>
              <button
                onClick={() => handleAdjustMinutes(5)}
                className="secondary-btn"
                style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '10px', minHeight: '36px' }}
              >
                +5m
              </button>
            </div>
          </div>
        )}

        {/* Circular Progress & Countdown */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '240px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
          <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`} style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              stroke="var(--c-surface-container-high)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Active Progress Ring */}
            <circle
              stroke="url(#timerGradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--c-primary)" />
                <stop offset="100%" stopColor="var(--c-secondary)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time text overlay */}
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 'clamp(32px, 8vw, 46px)', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-1px', color: 'var(--c-on-surface)' }}>
              {formatTime(secondsLeft)}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: isRunning ? 'var(--c-primary)' : 'var(--c-on-surface-variant)', marginTop: '-4px' }}>
              {isRunning ? 'FOCUSING...' : secondsLeft === totalSeconds ? 'READY' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Optional Focus Label Input */}
        <div style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="What are you focusing on? (e.g. Quran Study, Coding)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={isRunning && secondsLeft < totalSeconds}
            className="search-input"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid var(--c-outline-variant)',
              fontSize: '14px',
              textAlign: 'center',
              backgroundColor: 'var(--c-surface-container-high)',
              color: 'var(--c-on-surface)'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
          <button
            type="button"
            onClick={toggleStartPause}
            disabled={isSaving}
            className="primary-btn"
            style={{
              flex: '1 1 140px',
              padding: '14px 20px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '48px',
              color: 'var(--c-on-primary)'
            }}
          >
            {isRunning ? <Pause size={18} color="var(--c-on-primary)" /> : <Play size={18} color="var(--c-on-primary)" />}
            <span style={{ color: 'var(--c-on-primary)' }}>{isRunning ? 'Pause' : secondsLeft < totalSeconds ? 'Resume' : 'Start Focus'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving || (secondsLeft === totalSeconds && !isRunning)}
            className="secondary-btn"
            style={{
              flex: '1 1 90px',
              padding: '14px 16px',
              borderRadius: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '14px',
              minHeight: '48px',
              color: 'var(--c-on-surface)'
            }}
            title="Reset Timer"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          {secondsLeft < totalSeconds && (
            <button
              type="button"
              onClick={handleFinishEarly}
              disabled={isSaving}
              style={{
                flex: '1 1 120px',
                padding: '14px 16px',
                borderRadius: '14px',
                fontWeight: 700,
                backgroundColor: 'var(--c-task-done-bg)',
                color: 'var(--c-task-done-icon)',
                border: '1px solid var(--c-task-done-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '14px',
                minHeight: '48px',
                cursor: 'pointer'
              }}
              title="Log completed time so far"
            >
              <CheckCircle2 size={16} />
              <span>Finish Early</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
