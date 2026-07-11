'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- PERSON ACTIONS ---
export async function getPersons() {
  return await prisma.person.findMany({
    include: {
      debts: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function addPerson(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) throw new Error('Name is required');

  await prisma.person.create({
    data: { name },
  });
  revalidatePath('/debts');
}

export async function deletePerson(id: number) {
  await prisma.person.delete({
    where: { id },
  });
  revalidatePath('/debts');
}

export async function getPersonById(id: number) {
  return await prisma.person.findUnique({
    where: { id },
    include: {
      debts: {
        orderBy: { date: 'desc' }
      }
    }
  });
}

// --- DEBT RECORD ACTIONS ---
export async function addDebtRecord(formData: FormData) {
  const personId = Number(formData.get('personId'));
  const amount = Number(formData.get('amount'));
  const typeStr = formData.get('type') as string;
  const dateStr = formData.get('date') as string;
  const notes = formData.get('notes') as string | null;

  if (!personId || !amount || !typeStr || !dateStr) {
    throw new Error('Missing required fields');
  }

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
  await prisma.debtRecord.update({
    where: { id },
    data: { status: 'PAID' },
  });
  revalidatePath('/debts');
  revalidatePath(`/debts/${personId}`);
}

export async function markDebtPending(id: number, personId: number) {
  await prisma.debtRecord.update({
    where: { id },
    data: { status: 'PENDING' },
  });
  revalidatePath('/debts');
  revalidatePath(`/debts/${personId}`);
}

export async function deleteDebtRecord(id: number, personId: number) {
  await prisma.debtRecord.delete({
    where: { id }
  });
  revalidatePath('/debts');
  revalidatePath(`/debts/${personId}`);
}
