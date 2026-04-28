const prisma = require('../config/prisma');

const getAwards = async (req, res) => {
    try {
        const { institution_id, user_id } = req.query;
        let whereClause = { institution_id: parseInt(institution_id) };
        if (user_id) whereClause.user_id = parseInt(user_id);
        const result = await prisma.awards.findMany({
            where: whereClause,
            include: { users: true }
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createAward = async (req, res) => {
    try {
        const { user_id, title, category, description, certificate_url, institution_id } = req.body;
        const result = await prisma.awards.create({
            data: {
                user_id: parseInt(user_id),
                title,
                category,
                description,
                certificate_url,
                institution_id: parseInt(institution_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteAward = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.awards.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Award deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAwards, createAward, deleteAward };
