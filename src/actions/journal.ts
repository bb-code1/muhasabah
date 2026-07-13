'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { JournalCategory } from '@prisma/client';
import { getAuthenticatedUser } from '@/actions/auth';

export async function getJournalEntries(category: JournalCategory) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.journalEntry.findMany({
    where: { category, userId: user.id },
    orderBy: { date: 'desc' },
  });
}

export async function addJournalEntry(content: string, category: JournalCategory) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!content.trim()) {
    throw new Error('Content is required.');
  }

  await prisma.journalEntry.create({
    data: {
      content: content.trim(),
      category,
      date: new Date(),
      userId: user.id,
    },
  });
  revalidatePath(`/journal/${category.toLowerCase()}`);
}

export async function editJournalEntry(id: number, content: string, category: JournalCategory) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!content.trim()) {
    throw new Error('Content is required.');
  }

  await prisma.journalEntry.updateMany({
    where: { id, userId: user.id },
    data: {
      content: content.trim(),
    },
  });
  revalidatePath(`/journal/${category.toLowerCase()}`);
}

export async function deleteJournalEntry(id: number, category: JournalCategory) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.journalEntry.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath(`/journal/${category.toLowerCase()}`);
}
