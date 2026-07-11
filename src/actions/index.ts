'use server'

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- AUTHENTICATION ---
export async function loginAction(formData: FormData) {
  const password = formData.get('password');
  const APP_PASSWORD = process.env.APP_PASSWORD;

  if (password === APP_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }
  return { error: 'Invalid password' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
}

// --- EXPENSES ---
export async function getExpenses() {
  return await prisma.expense.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function addExpense(formData: FormData) {
  const amount = Number(formData.get('amount'));
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const dateStr = formData.get('date') as string;

  await prisma.expense.create({
    data: {
      amount,
      description,
      category,
      date: new Date(dateStr),
    },
  });

  revalidatePath('/expenses');
  revalidatePath('/'); // update dashboard
}

// --- GOALS ---
export async function getGoals() {
  return await prisma.goal.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function addGoal(formData: FormData) {
  const title = formData.get('title') as string;
  const targetDateStr = formData.get('targetDate') as string;
  
  await prisma.goal.create({
    data: {
      title,
      targetDate: targetDateStr ? new Date(targetDateStr) : null,
    },
  });

  revalidatePath('/goals');
  revalidatePath('/'); // update dashboard
}

export async function toggleGoal(id: number, currentState: boolean) {
  await prisma.goal.update({
    where: { id },
    data: { isCompleted: !currentState },
  });
  revalidatePath('/goals');
  revalidatePath('/');
}

// --- RELIGIOUS ACTIVITIES ---
export async function getReligiousActivity(dateStr: string) {
  const date = new Date(dateStr);
  const activity = await prisma.religiousActivity.findUnique({
    where: { date },
  });

  if (!activity) {
    return {
      date,
      fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false,
      quranReading: false, adhkar: false
    };
  }
  return activity;
}

export async function toggleReligiousActivity(dateStr: string, field: string, currentValue: boolean) {
  const date = new Date(dateStr);
  
  // Basic validation to ensure we only update allowed boolean fields
  const allowedFields = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'quranReading', 'adhkar'];
  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  // Use a transaction or upsert to safely create or update
  await prisma.religiousActivity.upsert({
    where: { date },
    update: {
      [field]: !currentValue,
    },
    create: {
      date,
      [field]: !currentValue,
    },
  });

  revalidatePath('/religious');
}
