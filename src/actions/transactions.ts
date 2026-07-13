'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/actions/auth';

export async function getTransactions(month?: number, year?: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const now = new Date();
  const currentMonth = month !== undefined ? month : now.getMonth();
  const currentYear = year !== undefined ? year : now.getFullYear();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

  return await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'desc' },
  });
}

export async function addTransaction(amount: number, description: string, type: 'INCOME' | 'EXPENSE') {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.transaction.create({
    data: {
      amount,
      description,
      type,
      date: new Date(),
      userId: user.id,
    },
  });
  revalidatePath('/transactions');
  revalidatePath('/');
}

export async function deleteTransaction(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.transaction.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/transactions');
  revalidatePath('/');
}
