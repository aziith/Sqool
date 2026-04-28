const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const admissionsCount = await prisma.admissions.count();
  const admissionCount = await prisma.admission.count();
  console.log('Admissions (plural) count:', admissionsCount);
  console.log('Admission (singular) count:', admissionCount);
  
  const lastAdmissions = await prisma.admissions.findMany({ take: 5, orderBy: { created_at: 'desc' } });
  console.log('Last 5 Admissions (plural):', JSON.stringify(lastAdmissions, null, 2));
  
  const lastAdmission = await prisma.admission.findMany({ take: 5, orderBy: { created_at: 'desc' } });
  console.log('Last 5 Admission (singular):', JSON.stringify(lastAdmission, null, 2));

  await prisma.$disconnect();
}

check();
