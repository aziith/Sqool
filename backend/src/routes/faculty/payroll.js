const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');

// Get payroll
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { month, year, teacher_id } = req.query;

    let whereClause = { institution_id: institutionId };
    if (month) whereClause.month = parseInt(month);
    if (year) whereClause.year = parseInt(year);
    if (teacher_id) whereClause.teacher_id = parseInt(teacher_id);

    const payrolls = await prisma.teacher_payroll.findMany({
      where: whereClause,
      include: {
        users: { select: { id: true, name: true, email: true, teachers: { select: { employee_id: true } } } }
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process/Update payroll
router.post('/', async (req, res) => {
  try {
    const { institution_id, teacher_id, month, year, basic_salary, allowances, deductions, status, remarks } = req.body;
    
    const basic = parseFloat(basic_salary) || 0;
    const allow = parseFloat(allowances) || 0;
    const deduc = parseFloat(deductions) || 0;
    const net = basic + allow - deduc;

    const record = await prisma.teacher_payroll.upsert({
      where: {
        teacher_id_month_year: {
          teacher_id: parseInt(teacher_id),
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      update: {
        basic_salary: basic,
        allowances: allow,
        deductions: deduc,
        net_salary: net,
        status: status || 'PENDING',
        remarks,
        payment_date: status === 'PAID' ? new Date() : null
      },
      create: {
        institution_id: parseInt(institution_id) || 1,
        teacher_id: parseInt(teacher_id),
        month: parseInt(month),
        year: parseInt(year),
        basic_salary: basic,
        allowances: allow,
        deductions: deduc,
        net_salary: net,
        status: status || 'PENDING',
        remarks,
        payment_date: status === 'PAID' ? new Date() : null
      }
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
