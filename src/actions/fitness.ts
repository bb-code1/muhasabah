'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/actions/auth';

export async function getFitnessLogs() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.fitnessLog.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });
}

export async function addFitnessLog(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const activity = formData.get('activity') as string;
  const duration = Number(formData.get('duration'));
  const distanceStr = formData.get('distance') as string;
  const distance = distanceStr ? Number(distanceStr) : null;
  const notes = formData.get('notes') as string | null;
  const dateStr = formData.get('date') as string;

  if (!activity || !duration || !dateStr) {
    throw new Error('Missing required fields');
  }

  await prisma.fitnessLog.create({
    data: {
      activity,
      duration,
      distance,
      notes,
      date: new Date(dateStr),
      userId: user.id,
    }
  });

  revalidatePath('/fitness');
  revalidatePath('/');
}

export async function deleteFitnessLog(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.fitnessLog.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/fitness');
  revalidatePath('/');
}
