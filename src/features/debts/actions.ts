'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/features/auth/actions';

// --- PERSON ACTIONS ---
export async function getPersons() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  return await prisma.person.findMany({
    where: { userId: user.id },
    include: {
      debts: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function addPerson(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  if (!name) throw new Error('Name is required');

  await prisma.person.create({
    data: { name, userId: user.id },
  });
  revalidatePath('/debts');
}

export async function deletePerson(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  await prisma.person.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath('/debts');
}

export async function getPersonById(id: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const person = await prisma.person.findFirst({
    where: { id, userId: user.id },
    include: {
      debts: {
        orderBy: { date: 'desc' }
      }
    }
  });

  return person;
}

// --- DEBT RECORD ACTIONS ---
export async function addDebtRecord(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const personId = Number(formData.get('personId'));
  const amount = Number(formData.get('amount'));
  const typeStr = formData.get('type') as string;
  const dateStr = formData.get('date') as string;
  const notes = formData.get('notes') as string | null;

  if (!personId || !amount || !typeStr || !dateStr) {
    throw new Error('Missing required fields');
  }

  // Verify person belongs to user
  const person = await prisma.person.findFirst({
    where: { id: personId, userId: user.id }
  });
  
  if (!person) throw new Error('Person not found or unauthorized');

  await prisma.debtRecord.create({
    data: {
      personId,
      amount,
      type: typeStr === 'CREDIT' ? 'CREDIT' : 'DEBIT',
      date: new Date(dateStr),
      status: 'PENDING',
      notes,
    }
  });

  revalidatePath('/debts');
  revalidatePath(`/debts/${personId}`);
}

export async function markDebtPaid(id: number, personId: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  // Ensure debt belongs to a person owned by the user
  const person = await prisma.person.findFirst({
    where: { id: personId, userId: user.id }
  });
  
  if (!person) throw new Error('Unauthorized');

  await prisma.debtRecord.updateMany({
    where: { id, personId },
    data: { status: 'PAID' },
  });
  revalidatePath('/debts');
  revalidatePath(`/debts/${personId}`);
}

export async function markDebtPending(id: number, personId: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const person = await prisma.person.findFirst({
    where: { id: personId, userId: user.id }
  });
  
  if (!person) throw new Error('Unauthorized');

  await prisma.debtRecord.updateMany({
    where: { id, personId },
    data: { status: 'PENDING' },
  });
  revalidatePath('/debts');
  revalidatePath(`/debts/${personId}`);
}

export async function deleteDebtRecord(id: number, personId: number) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');

  const person = await prisma.person.findFirst({
    where: { id: personId, userId: user.id }
  });
  
  if (!person) throw new Error('Unauthorized');

  await prisma.debtRecord.deleteMany({
    where: { id, personId }
  });
  revalidatePath('/debts');
  revalidatePath(`/debts/${personId}`);
}
