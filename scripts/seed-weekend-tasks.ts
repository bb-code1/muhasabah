import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialTasks = [
  'Bathing',
  'Ears Cleaning',
  'Clothes Washing',
  'Shoe Cleaning',
  'Washroom Cleaning',
  'Room Cleaning',
  'Beard Setting',
  'Hands Nail Cutting',
  'Hair Removal',
  'Feet Nail Cutting',
  'Hair Cutting',
  'Expense Tracker',
  'Tasks Tracker',
  'Iron Clothes'
];

async function main() {
  console.log('Seeding weekend tasks...');
  const existing = await prisma.weekendTask.count();
  
  if (existing > 0) {
    console.log('Weekend tasks already exist. Skipping.');
    return;
  }

  const data = initialTasks.map(title => ({ title }));
  
  await prisma.weekendTask.createMany({
    data
  });
  
  console.log('Weekend tasks seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
