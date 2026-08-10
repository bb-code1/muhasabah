'use client';

import React, { useState } from 'react';
import { setTopGoalNote, selectExistingTopGoal } from '@/features/goals/actions';
import { useToast } from '@/context/ToastContext';

interface TopGoalCardProps {
  topGoal: {
    id: number;
    title: string;
    description: string | null;
    category: string;
    priority: string;
    progress: number;
    isCompleted: boolean;
  } | null;
  allGoals: {
    id: number;
    title: string;
    description: string | null;
    category: string;
  }[];
}

export default function TopGoalCard({ topGoal, allGoals }: TopGoalCardProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(topGoal?.title || '');
  const [description, setDescription] = useState(topGoal?.description || '');
  const [selectedGoalId, setSelectedGoalId] = useState<number>(topGoal?.id || 0);

  const handleGoalSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setSelectedGoalId(val);
    if (val > 0) {
      const found = allGoals.find(g => g.id === val);
      if (found) {
        setTitle(found.title);
        setDescription(found.description || '');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Goal title is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (selectedGoalId > 0 && selectedGoalId === topGoal?.id && title === topGoal?.title && description === topGoal?.description) {
        await selectExistingTopGoal(selectedGoalId);
      } else {
        await setTopGoalNote(title.trim(), description.trim() || null, selectedGoalId > 0 ? selectedGoalId : undefined);
      }
      showToast('Top Goal updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast('Failed to update Top Goal', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '24px 28px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(191, 145, 41, 0.08) 0%, rgba(255, 255, 255, 1) 100%)',
        border: '2px solid rgba(191, 145, 41, 0.3)',
        boxShadow: '0 8px 24px rgba(191, 145, 41, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Background Decorative Emblem */}
      <span
        className="material-symbols-outlined"
        style={{
          position: 'absolute',
          right: '-16px',
          bottom: '-20px',
          fontSize: '140px',
          color: 'var(--c-primary)',
          opacity: 0.06,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        flex_no_fill
      </span>

      {/* TOP HEADER SECTION WITH BIG FONT */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--c-primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(191, 145, 41, 0.3)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 800 }}>
              target
            </span>
          </div>

          <div>
            {/* BIG FONT TOP GOAL HEADER */}
            <h2
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'var(--c-on-surface)',
                lineHeight: 1.15
              }}
            >
              TOP GOAL
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isEditing && topGoal) {
              setTitle(topGoal.title);
              setDescription(topGoal.description || '');
              setSelectedGoalId(topGoal.id);
            }
            setIsEditing(!isEditing);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: isEditing ? 'var(--c-surface-container-high)' : 'var(--c-primary-container)',
            color: isEditing ? 'var(--c-on-surface)' : 'var(--c-on-primary-container)',
            border: isEditing ? '1px solid var(--c-outline)' : '1px solid rgba(191, 145, 41, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'var(--transition-smooth)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {isEditing ? 'close' : topGoal ? 'edit_note' : 'add_circle'}
          </span>
          {isEditing ? 'Cancel' : topGoal ? 'Edit Note' : 'Set Top Goal'}
        </button>
      </div>

      {/* EDIT MODE FORM */}
      {isEditing ? (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          {allGoals.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>
                Pick from existing goals (Optional)
              </label>
              <select
                value={selectedGoalId}
                onChange={handleGoalSelectChange}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--c-outline)',
                  backgroundColor: 'var(--c-surface)',
                  color: 'var(--c-on-surface)',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value={0}>-- Create Custom Top Goal Note --</option>
                {allGoals.map(g => (
                  <option key={g.id} value={g.id}>
                    [{g.category}] {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>
              Top Goal Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Master Quranic Arabic & Memorize Surah Al-Baqarah"
              required
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--c-outline)',
                backgroundColor: 'var(--c-surface)',
                color: 'var(--c-on-surface)',
                fontSize: '16px',
                fontWeight: 700,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-on-surface-variant)' }}>
              Goal Note Description & Key Milestones
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mention the key details, action items, and motivation for this top goal..."
              rows={4}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--c-outline)',
                backgroundColor: 'var(--c-surface)',
                color: 'var(--c-on-surface)',
                fontSize: '14px',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="primary-btn"
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                check_circle
              </span>
              {isSaving ? 'Saving...' : 'Save Top Goal'}
            </button>
          </div>
        </form>
      ) : topGoal ? (
        /* NOTE CARD DISPLAY MODE */
        <div
          style={{
            padding: '20px 22px',
            borderRadius: '14px',
            backgroundColor: 'var(--c-surface)',
            border: '1.5px solid rgba(191, 145, 41, 0.25)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative'
          }}
        >


          {/* NOTE TITLE (BIGGER, BOLD TEXT) */}
          <h3
            style={{
              margin: 0,
              fontSize: '26px',
              fontWeight: 850,
              color: 'var(--c-on-surface)',
              lineHeight: 1.35
            }}
          >
            {topGoal.title}
          </h3>

          {/* NOTE DESCRIPTION (BIGGER TEXT) */}
          {topGoal.description ? (
            <p
              style={{
                margin: 0,
                fontSize: '18px',
                color: 'var(--c-on-surface-variant)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontWeight: 500
              }}
            >
              {topGoal.description}
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--c-on-surface-variant)' }}>
              No detailed note description added yet. Click &quot;Edit Note&quot; to add details about this goal.
            </p>
          )}
        </div>
      ) : (
        /* EMPTY STATE CARD */
        <div
          style={{
            padding: '24px',
            borderRadius: '14px',
            backgroundColor: 'var(--c-surface)',
            border: '2px dashed rgba(191, 145, 41, 0.4)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--c-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--c-on-primary-container)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              post_add
            </span>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--c-on-surface)' }}>
              No Top Goal Set Yet
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--c-on-surface-variant)' }}>
              Add a note highlighting your primary focus and description for this period.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="primary-btn"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              marginTop: '4px'
            }}
          >
            + Set Top Goal Note
          </button>
        </div>
      )}
    </div>
  );
}
