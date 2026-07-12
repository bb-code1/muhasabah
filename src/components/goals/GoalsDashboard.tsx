'use client';

import { useState } from 'react';
import { GoalItem } from './GoalItem';
import { AddGoalForm } from './AddGoalForm';
import { Goal, GoalCategory, GoalPriority } from '@prisma/client';

export function GoalsDashboard({ goals }: { goals: Goal[] }) {
  const [activeTab, setActiveTab] = useState<GoalCategory>('RELIGIOUS');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs: Array<{ value: GoalCategory; label: string }> = [
    { value: 'RELIGIOUS', label: 'Religious' },
    { value: 'CAREER', label: 'Career' },
    { value: 'FINANCES', label: 'Finances' },
    { value: 'HEALTH', label: 'Health & Fitness' },
    { value: 'PERSONAL', label: 'Personal' }
  ];

  const handleTabChange = (tab: GoalCategory) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filteredGoals = goals.filter(goal => {
    return goal.category === activeTab;
  });

  filteredGoals.sort((a, b) => {
    const priorityWeights: Record<GoalPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    if (priorityWeights[b.priority] !== priorityWeights[a.priority]) {
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination Logic
  const PAGE_SIZE = 25;
  const totalPages = Math.ceil(filteredGoals.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedGoals = filteredGoals.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  return (
    <div>
      <AddGoalForm activeCategory={activeTab} />

      <div style={{ marginBottom: '16px' }} />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--c-outline-variant)' }}>
        {tabs.map(tab => (
          <button 
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '24px',
              fontWeight: 600,
              backgroundColor: activeTab === tab.value ? 'var(--c-primary)' : 'transparent',
              color: activeTab === tab.value ? 'var(--c-on-primary)' : 'var(--c-on-surface-variant)',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {paginatedGoals.map(goal => (
          <GoalItem key={goal.id} goal={goal} />
        ))}
        {paginatedGoals.length === 0 && (
          <p className="text-on-surface-variant" style={{ textAlign: 'center', padding: '40px 0', fontStyle: 'italic' }}>
            No goals found under this category. Create one above!
          </p>
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
  );
}
