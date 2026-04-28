const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const db = require('../../config/db');

// Get syllabus list for an institution
router.get('/', async (req, res) => {
  try {
    const institutionId = parseInt(req.query.institution_id) || 1;
    
    try {
      if (prisma.syllabus) {
        const syllabuses = await prisma.syllabus.findMany({
          where: { institution_id: institutionId },
          include: {
            classes: { select: { name: true, section: true } },
            subjects: { select: { name: true } },
            users: { select: { name: true } },
            topics: true
          }
        });

        // Calculate progress %
        const formatted = syllabuses.map(s => {
          const total = s.topics.length;
          const completed = s.topics.filter(t => t.completion_status).length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          return { ...s, progress, total_topics: total, completed_topics: completed };
        });

        return res.json(formatted);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for syllabus list");
      const result = await db.query(`
        SELECT s.*, 
        json_build_object('name', c.name, 'section', c.section) as classes,
        json_build_object('name', sub.name) as subjects,
        json_build_object('name', u.name) as users,
        (
          SELECT json_agg(t.*) FROM topics t WHERE t.syllabus_id = s.id
        ) as topics
        FROM syllabuses s
        LEFT JOIN classes c ON s.class_id = c.id
        LEFT JOIN subjects sub ON s.subject_id = sub.id
        LEFT JOIN users u ON s.assigned_to = u.id
        WHERE s.institution_id = $1
      `, [institutionId]);

      const formatted = result.rows.map(s => {
        const topics = s.topics || [];
        const total = topics.length;
        const completed = topics.filter(t => t.completion_status).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { 
          ...s, 
          topics,
          progress, 
          total_topics: total, 
          completed_topics: completed 
        };
      });

      return res.json(formatted);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new syllabus mapping
router.post('/', async (req, res) => {
  try {
    const { institution_id, class_id, subject_id, assigned_to, topics } = req.body;
    
    try {
      if (prisma.syllabus) {
        // Create syllabus with nested topics
        const newSyllabus = await prisma.syllabus.create({
          data: {
            institution_id: parseInt(institution_id) || 1,
            class_id: parseInt(class_id),
            subject_id: parseInt(subject_id),
            assigned_to: assigned_to ? parseInt(assigned_to) : null,
            topics: {
              create: topics.map(t => ({
                title: t.title,
                description: t.description
              }))
            }
          },
          include: { topics: true }
        });
        return res.status(201).json(newSyllabus);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for syllabus creation");
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        const sylResult = await client.query(`
          INSERT INTO syllabuses (institution_id, class_id, subject_id, assigned_to)
          VALUES ($1, $2, $3, $4) RETURNING *
        `, [parseInt(institution_id) || 1, parseInt(class_id), parseInt(subject_id), assigned_to ? parseInt(assigned_to) : null]);
        
        const syllabus_id = sylResult.rows[0].id;
        const createdTopics = [];

        for (const topic of topics) {
          const tRes = await client.query(`
            INSERT INTO topics (syllabus_id, title, description)
            VALUES ($1, $2, $3) RETURNING *
          `, [syllabus_id, topic.title, topic.description]);
          createdTopics.push(tRes.rows[0]);
        }

        await client.query('COMMIT');
        return res.status(201).json({ ...sylResult.rows[0], topics: createdTopics });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Mark topic complete
router.patch('/topic/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;
    const { completion_status } = req.body;
    
    try {
      if (prisma.topic) {
        const updatedTopic = await prisma.topic.update({
          where: { id: parseInt(topicId) },
          data: { 
            completion_status, 
            completion_date: completion_status ? new Date() : null 
          }
        });
        return res.json(updatedTopic);
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      console.log("Falling back to raw SQL for topic update");
      const updatedTopic = await db.query(`
        UPDATE topics SET completion_status = $1, completion_date = $2 
        WHERE id = $3 RETURNING *
      `, [completion_status, completion_status ? new Date() : null, topicId]);
      return res.json(updatedTopic.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete syllabus
router.delete('/:id', async (req, res) => {
  try {
    try {
      if (prisma.syllabus) {
        await prisma.syllabus.delete({ where: { id: parseInt(req.params.id) } });
        return res.json({ message: 'Syllabus deleted successfully' });
      }
      throw new Error("Prisma not available");
    } catch (prismaErr) {
      await db.query('DELETE FROM syllabuses WHERE id = $1', [parseInt(req.params.id)]);
      return res.json({ message: 'Syllabus deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
