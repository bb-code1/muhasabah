'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- DAILY TASKS ---
export async function getDailyTasks(dateStr: string) {
  const targetDate = new Date(dateStr);
  return await prisma.dailyTask.findMany({
    where: { targetDate },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addDailyTask(formData: FormData) {
  const title = formData.get('title') as string;
  const dateStr = formData.get('date') as string;

  if (!title || !dateStr) throw new Error('Title and date are required.');

  await prisma.dailyTask.create({
    data: {
      title,
      targetDate: new Date(dateStr),
    },
  });
  revalidatePath('/');
}

export async function toggleDailyTask(id: number, currentState: boolean) {
  await prisma.dailyTask.update({
    where: { id },
    data: { isCompleted: !currentState },
  });
  revalidatePath('/');
}

export async function deleteDailyTask(id: number) {
  await prisma.dailyTask.delete({
    where: { id },
  });
  revalidatePath('/');
}

// --- WEEKEND TASKS ---
export async function getWeekendTasks() {
  return await prisma.weekendTask.findMany({
    orderBy: { id: 'asc' },
    include: { logs: true },
  });
}

export async function addWeekendTask(title: string) {
  if (!title) throw new Error('Title is required.');
  
  await prisma.weekendTask.create({
    data: { title },
  });
  revalidatePath('/tasks/weekend');
}

export async function deleteWeekendTask(id: number) {
  await prisma.weekendTask.delete({
    where: { id },
  });
  revalidatePath('/tasks/weekend');
}

export async function toggleWeekendTask(id: number, isCompleted: boolean, weekStartDateStr: string) {
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
