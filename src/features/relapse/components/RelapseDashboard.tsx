'use client';

import { useState, useEffect } from 'react';
import { RelapseLog } from '@prisma/client';
import { addRelapseLog, updateRelapseLog, deleteRelapseLog } from '@/features/relapse/actions';
import { useToast } from '@/context/ToastContext';
import CustomDateRangeDialog from '@/components/ui/CustomDateRangeDialog';

// Subcomponents
import RelapseHeatmap from './RelapseHeatmap';
import StreakAndActionBlock from './StreakAndActionBlock';
import FilterSection from './FilterSection';
import LogList from './LogList';
import AddLogModal from './AddLogModal';
import EditLogModal from './EditLogModal';
import ViewLogModal from './ViewLogModal';

const FILTER_TABS = [
  { id: 'TODAY', label: 'Today' },
  { id: 'WEEK', label: 'This Week' },
  { id: 'MONTH', label: 'This Month' },
  { id: 'YEAR', label: 'This Year' },
  { id: 'ALL', label: 'All Time' },
  { id: 'CUSTOM', label: 'Custom Range' },
];

export default function RelapseDashboard({ initialLogs }: { initialLogs: RelapseLog[] }) {
  const { showToast } = useToast();
  const [filterPeriod, setFilterPeriod] = useState('ALL');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<RelapseLog | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form states
  const [logDate, setLogDate] = useState('');
  const [logTime, setLogTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const openAddModal = () => {
    const now = new Date();
    // Format to local YYYY-MM-DD
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    
    setLogDate(`${yyyy}-${mm}-${dd}`);
    setLogTime(`${hh}:${min}`);
    setNotes('');
    setIsAddOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const combinedDateTime = new Date(`${logDate}T${logTime}`);
      await addRelapseLog(combinedDateTime, notes);
      setIsAddOpen(false);
      setCurrentPage(1);
      showToast('Occurrence logged.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to log occurrence', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog) return;
    setLoading(true);
    try {
      const combinedDateTime = new Date(`${logDate}T${logTime}`);
      await updateRelapseLog(selectedLog.id, combinedDateTime, notes);
      setIsEditOpen(false);
      setSelectedLog(null);
      showToast('Log updated.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to update log', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId: number) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    try {
      await deleteRelapseLog(logId);
      setSelectedLog(null);
      showToast('Log entry deleted.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to delete log', 'error');
    }
  };

  const handleFilterChange = (newPeriod: string) => {
    if (newPeriod === 'CUSTOM') {
      setIsCustomRangeOpen(true);
      return;
    }
    setFilterPeriod(newPeriod);
    setCurrentPage(1);
  };

  // Filter logs by period
  const filteredLogs = initialLogs.filter(log => {
    const d = new Date(log.date);
    const now = new Date();

    if (filterPeriod === 'ALL') return true;
    if (filterPeriod === 'TODAY') {
      return d.toDateString() === now.toDateString();
    }
    if (filterPeriod === 'WEEK') {
      const weekStart = new Date(now);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return d >= weekStart;
    }
    if (filterPeriod === 'MONTH') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (filterPeriod === 'YEAR') {
      return d.getFullYear() === now.getFullYear();
    }
    if (filterPeriod === 'CUSTOM') {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    }
    return true;
  });

  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedLogs = filteredLogs.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  return (
    <div>
      {/* Streak and Action Block */}
      <StreakAndActionBlock 
        initialLogs={initialLogs} 
        onOpenAddModal={openAddModal} 
      />

      {/* Heatmap calendar */}
      <RelapseHeatmap initialLogs={initialLogs} />

      {/* Filter and Count Section */}
      <FilterSection 
        filterTabs={FILTER_TABS}
        filterPeriod={filterPeriod} 
        handleFilterChange={handleFilterChange} 
        filteredLogsCount={filteredLogs.length} 
      />

      {isCustomRangeOpen && (
        <CustomDateRangeDialog
          initialStartDate={customStart}
          initialEndDate={customEnd}
          onClose={() => setIsCustomRangeOpen(false)}
          onApply={(startDate, endDate) => {
            setCustomStart(startDate);
            setCustomEnd(endDate);
            setFilterPeriod('CUSTOM');
            setCurrentPage(1);
            setIsCustomRangeOpen(false);
          }}
        />
      )}

      {/* List of logs */}
      <LogList 
        paginatedLogs={paginatedLogs} 
        setSelectedLog={setSelectedLog}
        currentPage={activePage} 
        totalPages={totalPages}
        setCurrentPage={setCurrentPage} 
      />

      {/* Modals */}
      {mounted && (
        <>
          <AddLogModal 
            isOpen={isAddOpen} 
            onClose={() => setIsAddOpen(false)} 
            onSubmit={handleAdd}
            logDate={logDate}
            setLogDate={setLogDate}
            logTime={logTime}
            setLogTime={setLogTime}
            notes={notes}
            setNotes={setNotes}
            loading={loading}
            mounted={mounted}
          />

          <ViewLogModal 
            selectedLog={selectedLog} 
            onClose={() => setSelectedLog(null)} 
            onEdit={() => {
              if (selectedLog) {
                const dateObj = new Date(selectedLog.date);
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dd = String(dateObj.getDate()).padStart(2, '0');
                const hh = String(dateObj.getHours()).padStart(2, '0');
                const min = String(dateObj.getMinutes()).padStart(2, '0');
                
                setLogDate(`${yyyy}-${mm}-${dd}`);
                setLogTime(`${hh}:${min}`);
                setNotes(selectedLog.notes || '');
                setIsEditOpen(true);
              }
            }} 
            onDelete={handleDelete} 
            mounted={mounted}
          />

          <EditLogModal 
            isOpen={isEditOpen} 
            selectedLog={selectedLog} 
            onClose={() => setIsEditOpen(false)} 
            onSubmit={handleUpdate}
            logDate={logDate}
            setLogDate={setLogDate}
            logTime={logTime}
            setLogTime={setLogTime}
            notes={notes}
            setNotes={setNotes}
            loading={loading}
            mounted={mounted}
          />
        </>
      )}
    </div>
  );
}
