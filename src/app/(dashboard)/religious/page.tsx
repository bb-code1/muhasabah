import { getSpiritualTodayData, getSpiritualHistory, getSpiritualHabits, seedDefaultSpiritualHabits } from '@/features/religious/actions';
import SpiritualDashboard from "@/features/religious/components/SpiritualDashboard";
import { getAuthenticatedUser } from '@/features/auth/actions';
import { getPrayerTimesAndMaghribStatus } from '@/features/timetable/actions';

import { getTodayDateString } from '@/lib/dateUtils';

export default async function ReligiousPage() {
  // Seed default habits (5 prayers + Adhkar) if none exist
  await seedDefaultSpiritualHabits();

  const user = await getAuthenticatedUser();
  const dateStr = getTodayDateString();

  const [todayData, history, allHabits, prayerTimesData] = await Promise.all([
    getSpiritualTodayData(dateStr),
    getSpiritualHistory(),
    getSpiritualHabits(),
    getPrayerTimesAndMaghribStatus()
  ]);

  const { maghribPassed } = prayerTimesData;
  const baseOffset = user?.hijriOffset ?? 0;

  return (
    <div style={{ padding: '0 24px 60px 24px' }}>
      <SpiritualDashboard
        dateStr={dateStr}
        initialTodayData={todayData}
        initialHistory={history}
        allHabits={allHabits}
        baseOffset={baseOffset}
        maghribPassed={maghribPassed}
      />
    </div>
  );
}
