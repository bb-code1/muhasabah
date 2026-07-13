'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { DuaCategory } from '@prisma/client';
import { getAuthenticatedUser } from '@/actions/auth';

export async function getDuas() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.dua.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addDua(title: string, content: string, translation: string | null, category: DuaCategory) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!title.trim() || !content.trim()) {
    throw new Error('Title and content are required.');
  }

  await prisma.dua.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      translation: translation?.trim() || null,
      category,
      userId: user.id,
    },
  });
  revalidatePath('/dua');
}

export async function updateDua(id: number, title: string, content: string, translation: string | null, category: DuaCategory) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!title.trim() || !content.trim()) {
    throw new Error('Title and content are required.');
  }

  await prisma.dua.updateMany({
    where: { id, userId: user.id },
    data: {
      title: title.trim(),
      content: content.trim(),
      translation: translation?.trim() || null,
      category,
    },
  });
  revalidatePath('/dua');
}

export async function deleteDua(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.dua.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/dua');
}
