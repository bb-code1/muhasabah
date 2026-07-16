'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { JournalCategory, JournalEntry } from '@prisma/client';
import { editJournalEntry } from '@/actions/index';
import { PREDEFINED_TOPICS, WORK_TYPES, MISC_ACTIVITIES } from './constants';
import { useToast } from '@/context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: JournalCategory;
  selectedEntry: JournalEntry | null;
  onSuccess: () => void;
}

export default function EditEntryModal({ isOpen, onClose, category, selectedEntry, onSuccess }: Props) {
  const { showToast } = useToast();

  const [editContent, setEditContent] = useState('');
  const [editSelectedTopicOption, setEditSelectedTopicOption] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editProject, setEditProject] = useState('');
  const [editTicketId, setEditTicketId] = useState('');
  const [editWorkType, setEditWorkType] = useState('Feature');
  const [editDuration, setEditDuration] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editActivity, setEditActivity] = useState('Other');
  const [editTag, setEditTag] = useState('');

  useEffect(() => {
    if (isOpen && selectedEntry) {
      setEditContent(selectedEntry.content);
      
      if (category === 'LEARNING') {
        const subj = selectedEntry.subject || '';
        if (PREDEFINED_TOPICS.includes(subj)) {
          setEditSelectedTopicOption(subj);
          setEditSubject('');
        } else if (subj) {
          setEditSelectedTopicOption('OTHER');
          setEditSubject(subj);
        } else {
          setEditSelectedTopicOption('');
          setEditSubject('');
        }
      }
      
      setEditProject(selectedEntry.project || '');
      setEditTicketId(selectedEntry.ticketId || '');
      setEditWorkType(selectedEntry.workType || 'Feature');
      setEditDuration(selectedEntry.duration || '');
      setEditLocation(selectedEntry.location || '');
      setEditActivity(selectedEntry.activity || 'Other');
      setEditTag(selectedEntry.tag || '');
    }
  }, [isOpen, selectedEntry, category]);

  if (!isOpen || !selectedEntry) return null;

  const handleEdit = async () => {
    try {
      const subjectValue = category === 'LEARNING'
        ? (editSelectedTopicOption === 'OTHER' ? editSubject.trim() || null : editSelectedTopicOption || null)
        : null;
      const projectValue = category === 'OFFICE' ? editProject.trim() || null : null;
      const ticketValue = category === 'OFFICE' ? editTicketId.trim() || null : null;
      const typeValue = category === 'OFFICE' ? editWorkType : null;
      const durationValue = category === 'OFFICE' ? editDuration.trim() || null : null;
      const locationValue = category === 'MISC' ? editLocation.trim() || null : null;
      const activityValue = category === 'MISC' ? editActivity : null;
      const tagValue = category === 'MISC' ? editTag.trim() || null : null;
      
      await editJournalEntry(
        selectedEntry.id, 
        editContent, 
        subjectValue,
        projectValue,
        ticketValue,
        typeValue,
        durationValue,
        locationValue,
        activityValue,
        tagValue
      );
      
      showToast('Entry updated!', 'success');
      onSuccess();
    } catch (error) {
      console.error(error);
      showToast('Failed to update entry', 'error');
    }
  };

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1010, padding: '16px', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>Edit Entry</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
        </div>

        {category === 'LEARNING' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Subject / Topic (Optional)
              </label>
              <select
                value={editSelectedTopicOption}
                onChange={(e) => setEditSelectedTopicOption(e.target.value)}
                className="search-input"
                style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px', padding: '10px 14px', backgroundColor: 'var(--c-surface-container-high)', border: '1px solid var(--c-outline-variant)' }}
              >
                <option value="">Select a topic (Optional)</option>
                {PREDEFINED_TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value="OTHER">Other...</option>
              </select>
            </div>
            
            {editSelectedTopicOption === 'OTHER' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Enter Custom Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, System Design, Communication"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
            )}
          </div>
        )}

        {category === 'OFFICE' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Project (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Payment Gateway"
                  value={editProject}
                  onChange={(e) => setEditProject(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Work Type
                </label>
                <select
                  value={editWorkType}
                  onChange={(e) => setEditWorkType(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px', padding: '10px 14px', backgroundColor: 'var(--c-surface-container-high)', border: '1px solid var(--c-outline-variant)' }}
                >
                  {WORK_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ticket ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. JIRA-4021"
                  value={editTicketId}
                  onChange={(e) => setEditTicketId(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Duration (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2.5h, 45m"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
            </div>
          </>
        )}

        {category === 'MISC' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Location / Place (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Nandi Hills"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Activity Type
                </label>
                <select
                  value={editActivity}
                  onChange={(e) => setEditActivity(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px', padding: '10px 14px', backgroundColor: 'var(--c-surface-container-high)', border: '1px solid var(--c-outline-variant)' }}
                >
                  {MISC_ACTIVITIES.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tag / Occasion (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. two days trip, dinner outside, weekend outing"
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                className="search-input"
                style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Description
          </label>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="search-input"
            style={{ width: '100%', borderRadius: '10px', resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', marginTop: '4px' }}>
          <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={handleEdit}
            className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
