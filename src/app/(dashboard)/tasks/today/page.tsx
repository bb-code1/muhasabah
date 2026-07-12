import TasksOfTheDay from '@/components/dashboard/TasksOfTheDay';
import Link from 'next/link';

export default async function TodayTasksPage(props: { searchParams?: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const pageStr = searchParams?.page || '1';
  const page = parseInt(pageStr, 10) || 1;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/tasks" className="nav-item flex-row mb-16" style={{ width: 'fit-content', padding: '8px 16px', gap: '8px' }}>
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Tasks</span>
        </Link>
        <h2 className="text-headline-md" style={{ margin: 0 }}>Today's Tasks</h2>
      </div>
      <div className="grid-container">
        <div className="col-span-12 flex-col gap-24" style={{ alignContent: 'start' }}>
          <TasksOfTheDay dateStr={todayStr} page={page} />
        </div>
      </div>
    </>
  );
}
