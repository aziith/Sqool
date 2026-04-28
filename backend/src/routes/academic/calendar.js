const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');

// Get all academic events for the calendar
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    const { month, year } = req.query;
    
    const whereClause = { institution_id: institutionId };
    
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      whereClause.start_date = { gte: startDate, lt: endDate };
    }

    const events = await prisma.academicEvent.findMany({
      where: whereClause,
      orderBy: { start_date: 'asc' }
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add an academic event
router.post('/', async (req, res) => {
  try {
    const { institution_id, title, event_type, start_date, end_date, description } = req.body;
    
    const newEvent = await prisma.academicEvent.create({
      data: {
        institution_id: parseInt(institution_id) || 1,
        title,
        event_type: event_type || 'EVENT',
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        description
      }
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    await prisma.academicEvent.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
