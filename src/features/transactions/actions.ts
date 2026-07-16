'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/features/auth/actions';

export async function getTransactions() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function addTransaction(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const amount = Number(formData.get('amount'));
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const dateStr = formData.get('date') as string;
  const typeStr = formData.get('type') as string;
  const type = typeStr === 'INCOME' ? 'INCOME' : 'EXPENSE';

  if (!amount || !description || !category || !dateStr) {
    throw new Error('All fields are required.');
  }

  await prisma.transaction.create({
    data: {
      amount,
      description,
      category,
      type,
      date: new Date(dateStr),
      userId: user.id,
    },
  });
  revalidatePath('/transactions');
  revalidatePath('/');
}
