const prisma = require('../config/prisma');

const getFeesList = async (req, res) => {
    try {
        const { institution_id, student_id } = req.query;
        let whereClause = { institution_id: parseInt(institution_id) };
        if (student_id) whereClause.student_id = parseInt(student_id);
        const result = await prisma.fees.findMany({
            where: whereClause,
            include: { users: true }
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const assignFee = async (req, res) => {
    try {
        const { student_id, amount_due, due_date, institution_id } = req.body;
        const result = await prisma.fees.create({
            data: {
                student_id: parseInt(student_id),
                amount_due: parseFloat(amount_due),
                due_date: new Date(due_date),
                status: 'Pending',
                institution_id: parseInt(institution_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const collectPayment = async (req, res) => {
    try {
        const { fee_id, amount_paid, payment_mode, remarks } = req.body;
        const fee = await prisma.fees.findUnique({ where: { id: parseInt(fee_id) } });

        const updatedPaid = parseFloat(fee.amount_paid) + parseFloat(amount_paid);
        let status = 'Partial';
        if (updatedPaid >= parseFloat(fee.amount_due)) status = 'Paid';

        const result = await prisma.$transaction([
            prisma.fees.update({
                where: { id: parseInt(fee_id) },
                data: { amount_paid: updatedPaid, status }
            }),
            prisma.fee_payments.create({
                data: {
                    student_id: fee.student_id,
                    amount_paid: parseFloat(amount_paid),
                    payment_mode: payment_mode || 'CASH',
                    remarks: remarks,
                    institution_id: fee.institution_id
                }
            })
        ]);
        
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getFeesList, assignFee, collectPayment };
