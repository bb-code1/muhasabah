'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/features/auth/actions';

export async function getFocusSessions() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.focusSession.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: 'desc' },
  });
}

export async function addFocusSession(duration: number, label?: string | null) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  if (!duration || duration <= 0) {
    throw new Error('Focus duration must be greater than 0 minutes.');
  }

  const session = await prisma.focusSession.create({
    data: {
      userId: user.id,
      duration,
      label: label ? label.trim() : null,
      completedAt: new Date(),
    },
  });

  revalidatePath('/tools');
  return session;
}

export async function deleteFocusSession(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.focusSession.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath('/tools');
}

export async function updateFocusSessionLabel(id: number, label: string | null) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.focusSession.updateMany({
    where: {
      id,
      userId: user.id,
    },
    data: {
      label: label ? label.trim() : null,
    },
  });

  revalidatePath('/tools');
}

