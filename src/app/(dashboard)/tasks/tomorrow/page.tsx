import TasksOfTheDay from '@/components/dashboard/TasksOfTheDay';
import Link from 'next/link';

export default async function TomorrowPage(props: { searchParams?: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const pageStr = searchParams?.page || '1';
  const page = parseInt(pageStr, 10) || 1;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <div>
      <Link href="/tasks" className="nav-item flex-row mb-24" style={{ width: 'fit-content', padding: '8px 16px', gap: '8px' }}>
        <span className="material-symbols-outlined">arrow_back</span>
        <span>Back to Tasks</span>
      </Link>
      <TasksOfTheDay dateStr={tomorrowStr} page={page} />
    </div>
  );
}
