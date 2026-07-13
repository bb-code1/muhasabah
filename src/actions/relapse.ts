'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/actions/auth';

export async function getRelapseLogs() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.relapseLog.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });
}

export async function addRelapseLog(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const notes = formData.get('notes') as string | null;
  const dateStr = formData.get('date') as string;

  if (!dateStr) {
    throw new Error('Date is required');
  }

  // Use the time provided or current time if only date is passed
  let dateObj = new Date(dateStr);
  if (dateStr.length === 10) { 
    // It's just YYYY-MM-DD
    const now = new Date();
    dateObj.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
  }

  await prisma.relapseLog.create({
    data: {
      date: dateObj,
      notes: notes?.trim() || null,
      userId: user.id,
    }
  });

  revalidatePath('/relapse');
  revalidatePath('/');
}

export async function updateRelapseLog(id: number, date: Date, notes: string | null) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.relapseLog.updateMany({
    where: { id, userId: user.id },
    data: {
      date: new Date(date),
      notes: notes?.trim() || null,
    },
  });
  revalidatePath('/relapse');
  revalidatePath('/');
}

export async function deleteRelapseLog(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.relapseLog.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/relapse');
  revalidatePath('/');
}
