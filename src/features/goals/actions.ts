'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { GoalCategory, GoalPriority } from '@prisma/client';
import { getAuthenticatedUser } from '@/features/auth/actions';

export async function getGoals() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.goal.findMany({
    where: { userId: user.id },
    orderBy: [{ priority: 'desc' }, { targetDate: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function addGoal(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const targetDateStr = formData.get('targetDate') as string;
  const description = formData.get('description') as string || null;
  const category = (formData.get('category') as GoalCategory) || 'PERSONAL';
  const priority = (formData.get('priority') as GoalPriority) || 'MEDIUM';
  const reminders = formData.get('reminders') === 'true';
  
  await prisma.goal.create({
    data: {
      title,
      description,
      category,
      priority,
      reminders,
      targetDate: targetDateStr ? new Date(targetDateStr) : null,
      userId: user.id,
    },
  });

  revalidatePath('/goals');
  revalidatePath('/'); 
}

export async function toggleGoal(id: number, currentState: boolean) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.goal.updateMany({
    where: { id, userId: user.id },
    data: { 
      isCompleted: !currentState,
      progress: !currentState ? 100 : 0 
    },
  });
  revalidatePath('/goals');
  revalidatePath('/');
}

export async function updateGoalProgress(id: number, progress: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.goal.updateMany({
    where: { id, userId: user.id },
    data: { 
      progress,
      isCompleted: progress === 100 
    },
  });
  revalidatePath('/goals');
  revalidatePath('/');
}

export async function editGoal(id: number, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const targetDateStr = formData.get('targetDate') as string;
  const description = formData.get('description') as string || null;
  const category = (formData.get('category') as GoalCategory) || 'PERSONAL';
  const priority = (formData.get('priority') as GoalPriority) || 'MEDIUM';
  const progress = parseInt(formData.get('progress') as string) || 0;
  
  await prisma.goal.updateMany({
    where: { id, userId: user.id },
    data: {
      title,
      description,
      category,
      priority,
      progress,
      isCompleted: progress === 100,
      targetDate: targetDateStr ? new Date(targetDateStr) : null,
    },
  });

  revalidatePath('/goals');
  revalidatePath('/');
}

export async function deleteGoal(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.goal.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/goals');
  revalidatePath('/');
}
