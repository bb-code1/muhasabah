'use client';

import { useState } from 'react';
import { GoalItem } from './GoalItem';
import { AddGoalForm } from './AddGoalForm';
import { Search, Archive } from 'lucide-react';
import { Goal, GoalPriority } from '@prisma/client';

export function GoalsDashboard({ goals }: { goals: Goal[] }) {
  const [activeTab, setActiveTab] = useState('MONTHLY');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState('priority');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME'];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleArchiveToggle = () => {
    setShowArchived(!showArchived);
    setCurrentPage(1);
  };

  const filteredGoals = goals.filter(goal => {
    if (goal.period !== activeTab && !showArchived) return false;
    if (goal.period !== activeTab) return false;
    if (goal.isArchived !== showArchived) return false;
    if (search && !goal.title.toLowerCase().includes(search.toLowerCase()) && !goal.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filteredGoals.sort((a, b) => {
    if (sortBy === 'priority') {
      const p: Record<GoalPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (p[b.priority] !== p[a.priority]) return p[b.priority] - p[a.priority];
    }
    if (sortBy === 'progress') {
      if (b.progress !== a.progress) return b.progress - a.progress;
    }
    if (sortBy === 'date') {
      if (!a.targetDate) return 1;
      if (!b.targetDate) return -1;
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination Logic
  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(filteredGoals.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedGoals = filteredGoals.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  return (
    <div>
      <AddGoalForm />

      <div className="flex-row gap-16 mb-24" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-on-surface-variant)' }} />
          <input 
            type="text" 
            placeholder="Search goals..." 
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
            style={{ width: '100%', paddingLeft: '40px', borderRadius: '8px' }}
          />
        </div>
        
        <select 
          value={sortBy} 
          onChange={(e) => handleSortChange(e.target.value)}
          className="search-input"
          style={{ borderRadius: '8px', padding: '8px 16px', width: 'auto' }}
        >
          <option value="priority">Sort by Priority</option>
          <option value="progress">Sort by Progress</option>
          <option value="date">Sort by Target Date</option>
        </select>

        <button 
          onClick={handleArchiveToggle}
          className="primary-btn"
          style={{ backgroundColor: showArchived ? 'var(--c-primary)' : 'var(--c-surface-container-high)', color: showArchived ? 'var(--c-on-primary)' : 'var(--c-on-surface)', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}
        >
          <Archive size={18} /> {showArchived ? 'Hide Archived' : 'Show Archived'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--c-outline-variant)' }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '24px',
              fontWeight: 600,
              backgroundColor: activeTab === tab ? 'var(--c-primary)' : 'transparent',
              color: activeTab === tab ? 'var(--c-on-primary)' : 'var(--c-on-surface-variant)',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {paginatedGoals.map(goal => (
          <GoalItem key={goal.id} goal={goal} />
        ))}
        {paginatedGoals.length === 0 && (
          <p className="text-on-surface-variant" style={{ textAlign: 'center', padding: '40px 0' }}>
            {showArchived ? "No archived goals for this period." : "No goals found. Create one above!"}
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
