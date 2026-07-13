'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/actions/auth';

export async function getBooks() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.book.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addBook(title: string, author: string | null, driveLink: string | null, notes: string | null) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!title.trim()) {
    throw new Error('Title is required.');
  }

  await prisma.book.create({
    data: {
      title: title.trim(),
      author: author?.trim() || null,
      driveLink: driveLink?.trim() || null,
      notes: notes?.trim() || null,
      date: new Date(),
      userId: user.id,
    },
  });
  revalidatePath('/books');
  revalidatePath('/');
}

export async function updateBook(id: number, title: string, author: string | null, driveLink: string | null, notes: string | null) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!title.trim()) {
    throw new Error('Title is required.');
  }

  await prisma.book.updateMany({
    where: { id, userId: user.id },
    data: {
      title: title.trim(),
      author: author?.trim() || null,
      driveLink: driveLink?.trim() || null,
      notes: notes?.trim() || null,
    },
  });
  revalidatePath('/books');
  revalidatePath('/');
}

export async function deleteBook(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.book.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/books');
  revalidatePath('/');
}
