'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/actions/auth';

// --- DAILY TASKS ---
export async function getDailyTasks(dateStr: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const targetDate = new Date(dateStr);
  return await prisma.dailyTask.findMany({
    where: { targetDate, userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addDailyTask(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const dateStr = formData.get('date') as string;

  if (!title || !dateStr) throw new Error('Title and date are required.');

  await prisma.dailyTask.create({
    data: {
      title,
      targetDate: new Date(dateStr),
      userId: user.id,
    },
  });
  revalidatePath('/');
}

export async function toggleDailyTask(id: number, currentState: boolean) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.dailyTask.updateMany({
    where: { id, userId: user.id },
    data: { isCompleted: !currentState },
  });
  revalidatePath('/');
}

export async function deleteDailyTask(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.dailyTask.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/');
}

// --- WEEKEND TASKS ---
export async function getWeekendTasks() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.weekendTask.findMany({
    where: { userId: user.id },
    orderBy: { id: 'asc' },
    include: { logs: true },
  });
}

export async function addWeekendTask(title: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!title) throw new Error('Title is required.');
  
  await prisma.weekendTask.create({
    data: { title, userId: user.id },
  });
  revalidatePath('/tasks/weekend');
}

export async function deleteWeekendTask(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.weekendTask.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/tasks/weekend');
}

export async function toggleWeekendTask(id: number, isCompleted: boolean, weekStartDateStr: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const weekendTask = await prisma.weekendTask.findFirst({
    where: { id, userId: user.id }
  });
  if (!weekendTask) throw new Error('Unauthorized');

  const weekStartDate = new Date(weekStartDateStr);

  if (isCompleted) {
    await prisma.weekendTaskLog.upsert({
      where: {
        weekendTaskId_weekStartDate: {
          weekendTaskId: id,
          weekStartDate: weekStartDate
        }
      },
      create: {
        weekendTaskId: id,
        weekStartDate: weekStartDate,
        date: new Date()
      },
      update: {}
    });
  } else {
    await prisma.weekendTaskLog.deleteMany({
      where: {
        weekendTaskId: id,
        weekStartDate: weekStartDate
      }
    });
  }
  revalidatePath('/tasks/weekend');
}

// --- RECURRING TRACKERS ---
export async function getRecurringTrackers() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.recurringTracker.findMany({
    where: { userId: user.id },
    orderBy: { title: 'asc' },
  });
}

export async function addRecurringTracker(title: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!title.trim()) throw new Error('Title is required.');
  await prisma.recurringTracker.create({
    data: { title: title.trim(), userId: user.id },
  });
  revalidatePath('/tasks');
}

export async function updateRecurringLastDone(id: number, dateValueStr: string | null) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const lastDone = dateValueStr ? new Date(dateValueStr) : null;
  await prisma.recurringTracker.updateMany({
    where: { id, userId: user.id },
    data: { lastDone },
  });
  revalidatePath('/tasks');
}

export async function deleteRecurringTracker(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.recurringTracker.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/tasks');
}
