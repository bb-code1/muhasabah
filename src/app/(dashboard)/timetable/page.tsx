import { getTimeTable } from '@/actions/timetable';
import TimetableForm from '@/components/timetable/TimetableForm';
import { CalendarRange } from 'lucide-react';

export default async function TimetablePage() {
  const timetable = await getTimeTable();

  return (
    <div style={{ padding: '0 24px 60px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <CalendarRange color="var(--c-primary)" size={28} />
        <h2 className="text-headline-md" style={{ margin: 0 }}>Daily Time Table</h2>
      </div>

      <div className="w-full">
        <TimetableForm initialData={timetable} />
      </div>
    </div>
  );
}
