import { getExpenses, getGoals, getReligiousActivity } from '@/actions';
import DailyFocus from './DailyFocus';
import Link from 'next/link';

export default async function Dashboard() {
  const expenses = await getExpenses();
  const goals = await getGoals();
  const todayStr = new Date().toISOString().split('T')[0];
  const religiousData = await getReligiousActivity(todayStr);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <>
      <section className="quick-actions-grid">
        <Link href="/expenses" className="quick-action-btn group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="icon-box" style={{ backgroundColor: 'var(--c-error-container)', color: 'var(--c-error)' }}>
              <span className="material-symbols-outlined">add_card</span>
            </div>
            <span className="text-headline-md font-semibold">Add Expense</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </Link>
        <Link href="/religious" className="quick-action-btn group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="icon-box" style={{ backgroundColor: 'var(--c-secondary-container)', color: 'var(--c-secondary)' }}>
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <span className="text-headline-md font-semibold">Log Activity</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </Link>
        <Link href="/goals" className="quick-action-btn group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="icon-box" style={{ backgroundColor: 'var(--c-tertiary-fixed)', color: 'var(--c-tertiary)' }}>
              <span className="material-symbols-outlined">flag</span>
            </div>
            <span className="text-headline-md font-semibold">Update Goal</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </Link>
      </section>

      <div className="grid-container">
        <DailyFocus religiousData={religiousData} dateStr={todayStr} goals={goals} />

        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ backgroundColor: 'var(--c-primary)', color: 'var(--c-on-primary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <p className="text-label-sm" style={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Monthly Spending</p>
                <span className="material-symbols-outlined" style={{ opacity: 0.6 }}>trending_down</span>
              </div>
              <h3 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>${monthlyExpenses.toFixed(2)}</h3>
              <p className="text-label-sm" style={{ color: 'var(--c-on-primary-container)' }}>Expenses tracked this month</p>
            </div>
            <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '160px', height: '160px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', filter: 'blur(24px)' }}></div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="text-headline-md">Top Goals</h3>
              <Link href="/goals" className="text-label-sm text-primary">View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {goals.slice(0, 3).map((goal, i) => {
                const colors = ['var(--c-secondary)', 'var(--c-tertiary-container)', 'var(--c-on-tertiary-container)'];
                return (
                  <div key={goal.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                      <span className="text-body-md" style={{ fontWeight: 500 }}>{goal.title}</span>
                      <span className="text-label-sm">{goal.isCompleted ? '100%' : '50%'}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: goal.isCompleted ? '100%' : '50%', backgroundColor: colors[i % colors.length] }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-12 card" style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'var(--c-secondary-container)', color: 'var(--c-secondary)', borderRadius: '9999px', marginBottom: '16px' }} className="text-label-sm">Pro Tip</span>
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Consistency beats intensity every single time.</h4>
            <p className="text-body-md text-on-surface-variant" style={{ maxWidth: '600px', marginBottom: '8px' }}>You've logged activities for 12 consecutive days. Keep up the momentum to build lasting habits.</p>
          </div>
          <div style={{ width: '100%', maxWidth: '300px', height: '192px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--c-surface-container-high)', flexShrink: 0 }}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnSh2Xt5L3x621DAMcHm7rDCAaI3Bzp89RI3RpzFxe4Bx8BmmSQbdaCgT0WZPVxUm5o2qUTSF2U7ASOrproCupR-t8hrJJpBrjDin7Qm31uIY5Lc4fF47six2w0ZANQTFIa_qAjpw6qEFLNIrR1v7FfCkGUxK6LkeCrwcFbHfWesOqu7BJ2AOI84C7I1Wnw6iVCSJZybuA33ieIF7LCHloYcKOPb7cVDZjOXiF4ZGj1-i8esKZTZNZ6VkOcNqwAFzD5V4m6giEzQs" alt="Zen stones" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </>
  );
}
