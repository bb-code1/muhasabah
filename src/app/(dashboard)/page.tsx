import { getTransactions } from '@/actions';
import TasksOfTheDay from '@/components/dashboard/TasksOfTheDay';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { href: '/transactions', icon: 'add_card', label: 'Add Transaction' },
  { href: '/journal', icon: 'edit_note', label: 'Log Journal' },
  { href: '/goals', icon: 'flag', label: 'Update Goal' },
  { href: '/tasks/tomorrow', icon: 'event_upcoming', label: 'Plan Tomorrow' },
  { href: '/religious', icon: 'auto_awesome', label: 'Spiritual' },
];

export default async function Dashboard() {
  const transactions = await getTransactions();

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay());
  
  const dailySpending = transactions
    .filter(t => new Date(t.date) >= todayStart && t.type === 'EXPENSE')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const weeklySpending = transactions
    .filter(t => new Date(t.date) >= weekStart && t.type === 'EXPENSE')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const monthlySpending = transactions
    .filter(t => new Date(t.date) >= startOfMonth && t.type === 'EXPENSE')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const yearlySpending = transactions
    .filter(t => new Date(t.date) >= startOfYear && t.type === 'EXPENSE')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <>
      {/* SPENDING SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'TODAY', amount: dailySpending },
          { label: 'THIS WEEK', amount: weeklySpending },
          { label: 'THIS MONTH', amount: monthlySpending, highlight: true },
          { label: 'THIS YEAR', amount: yearlySpending }
        ].map((item, i) => (
          <div 
            key={i} 
            className={`card flex-col justify-center p-16 ${item.highlight ? 'highlight-card' : ''}`}
            style={{ 
              backgroundColor: 'var(--c-surface-container-high)',
              borderTop: item.highlight ? '3px solid var(--c-primary)' : '1px solid var(--c-outline-variant)'
            }}
          >
            <span className="text-label-sm text-on-surface-variant mb-8">{item.label}</span>
            <h3 className="summary-amount" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              ${item.amount.toFixed(2)}
            </h3>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions-container">
        {QUICK_ACTIONS.map((action, i) => (
          <Link key={i} href={action.href} className="quick-action-item">
            <span className="quick-action-icon-wrapper">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{action.icon}</span>
            </span>
            <span className="text-body-md" style={{ fontWeight: 600 }}>{action.label}</span>
            <span className="quick-action-arrow">→</span>
          </Link>
        ))}
      </div>

      <div className="grid-container">
        <div className="col-span-12 flex-col gap-24" style={{ alignContent: 'start' }}>
          <TasksOfTheDay dateStr={todayStr} />
        </div>
      </div>
    </>
  );
}
