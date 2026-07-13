'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { JournalCategory } from '@prisma/client';
import { getAuthenticatedUser } from '@/actions/auth';

export async function getJournalEntries(category?: JournalCategory) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addJournalEntry(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const content = formData.get('content') as string;
  const categoryStr = formData.get('category') as string;
  const category = categoryStr as JournalCategory;
  const subject = formData.get('subject') as string || null;

  if (!content || !category) throw new Error('Content and category are required.');

  await prisma.journalEntry.create({
    data: {
      content,
      category,
      subject,
      date: new Date(),
      userId: user.id,
    },
  });
  revalidatePath('/journal/office');
  revalidatePath('/journal/learning');
  revalidatePath('/journal/misc');
  revalidatePath('/');
}

export async function deleteJournalEntry(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.journalEntry.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/journal/office');
  revalidatePath('/journal/learning');
  revalidatePath('/journal/misc');
  revalidatePath('/');
}

export async function editJournalEntry(id: number, content: string, subject?: string | null) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.journalEntry.updateMany({
    where: { id, userId: user.id },
    data: { 
      content,
      ...(subject !== undefined ? { subject } : {})
    },
  });
  revalidatePath('/journal/office');
  revalidatePath('/journal/learning');
  revalidatePath('/journal/misc');
  revalidatePath('/');
}
