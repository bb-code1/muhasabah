'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { JournalCategory } from '@prisma/client';
import { addJournalEntry } from '@/actions/index';
import { PREDEFINED_TOPICS, WORK_TYPES, MISC_ACTIVITIES } from './constants';
import { useToast } from '@/context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: JournalCategory;
  onSuccess: () => void;
}

export default function AddEntryModal({ isOpen, onClose, category, onSuccess }: Props) {
  const { showToast } = useToast();
  
  const [content, setContent] = useState('');
  const [selectedTopicOption, setSelectedTopicOption] = useState('');
  const [subject, setSubject] = useState('');
  const [project, setProject] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [workType, setWorkType] = useState('Feature');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('Other');
  const [tag, setTag] = useState('');
  
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('category', category);
      
      if (category === 'LEARNING') {
        const finalSubject = selectedTopicOption === 'OTHER' ? subject.trim() : selectedTopicOption;
        if (finalSubject) {
          formData.append('subject', finalSubject);
        }
      }
      
      if (category === 'OFFICE') {
        if (project.trim()) formData.append('project', project.trim());
        if (ticketId.trim()) formData.append('ticketId', ticketId.trim());
        if (workType) formData.append('workType', workType);
        if (duration.trim()) formData.append('duration', duration.trim());
      }

      if (category === 'MISC') {
        if (location.trim()) formData.append('location', location.trim());
        if (activity) formData.append('activity', activity);
        if (tag.trim()) formData.append('tag', tag.trim());
      }
      
      await addJournalEntry(formData);
      setContent('');
      setSubject('');
      setSelectedTopicOption('');
      setProject('');
      setTicketId('');
      setWorkType('Feature');
      setDuration('');
      setLocation('');
      setActivity('Other');
      setTag('');
      
      showToast('Entry added successfully!', 'success');
      onSuccess();
    } catch (error) {
      console.error(error);
      showToast('Failed to add entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-outline-variant)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 className="text-headline-sm" style={{ margin: 0, fontWeight: 700 }}>
            {category === 'OFFICE' ? 'Log Office Work' : category === 'LEARNING' ? 'What did I learn today?' : category === 'MISC' ? 'Log Life Event' : 'New Journal Entry'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-on-surface-variant)' }}><X size={20} /></button>
        </div>
        
        {category === 'LEARNING' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Subject / Topic (Optional)
              </label>
              <select
                value={selectedTopicOption}
                onChange={(e) => setSelectedTopicOption(e.target.value)}
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
            
            {selectedTopicOption === 'OTHER' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Enter Custom Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, System Design, Communication"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Work Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
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
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
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
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--c-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Activity Type
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
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
                value={tag}
                onChange={(e) => setTag(e.target.value)}
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
            placeholder={category === 'OFFICE' ? "Write about what work you accomplished..." : category === 'MISC' ? "Describe your activity (e.g. Went for dining, sightseeing...)" : "Write entry details..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="search-input"
            style={{ width: '100%', borderRadius: '10px', resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--c-outline-variant)', paddingTop: '16px', marginTop: '4px' }}>
          <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--c-on-surface-variant)', border: '1px solid var(--c-outline-variant)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleAdd} className="primary-btn" disabled={loading} style={{ padding: '10px 24px', borderRadius: '8px' }}>{loading ? 'Saving...' : 'Save Entry'}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
