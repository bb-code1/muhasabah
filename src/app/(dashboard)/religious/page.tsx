import { getSpiritualTodayData, getSpiritualHistory, getSpiritualHabits, seedDefaultSpiritualHabits } from '@/features/religious/actions';
import SpiritualDashboard from "@/features/religious/components/SpiritualDashboard";
import { getTodayDateString } from '@/lib/dateUtils';

export default async function ReligiousPage() {
  // Seed default habits (5 prayers + Adhkar) if none exist
  await seedDefaultSpiritualHabits();

  const dateStr = getTodayDateString();

  const [todayData, history, allHabits] = await Promise.all([
    getSpiritualTodayData(dateStr),
    getSpiritualHistory(),
    getSpiritualHabits()
  ]);

  return (
    <div style={{ padding: '0 24px 60px 24px' }}>
      <SpiritualDashboard
        dateStr={dateStr}
        initialTodayData={todayData}
        initialHistory={history}
        allHabits={allHabits}
      />
    </div>
  );
}
