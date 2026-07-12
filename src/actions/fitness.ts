'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getFitnessLogs() {
  return await prisma.fitnessLog.findMany({
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ],
  });
}

export async function addFitnessLog(
  activity: string,
  duration: number,
  distance: number | null,
  notes: string | null,
  date: Date
) {
  if (!activity) throw new Error('Activity type is required.');
  if (duration <= 0) throw new Error('Duration must be greater than 0.');

  await prisma.fitnessLog.create({
    data: {
      activity,
      duration,
      distance,
      notes,
      date,
    },
  });
  revalidatePath('/fitness');
}

export async function deleteFitnessLog(id: number) {
  await prisma.fitnessLog.delete({
    where: { id },
  });
  revalidatePath('/fitness');
}
