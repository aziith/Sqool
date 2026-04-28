const prisma = require('../config/prisma');

const getAlbums = async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await prisma.album.findMany({
            where: { institution_id: parseInt(institution_id) },
            include: { media: true }
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createAlbum = async (req, res) => {
    try {
        const { title, institution_id } = req.body;
        const result = await prisma.album.create({
            data: {
                title,
                institution_id: parseInt(institution_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const uploadMedia = async (req, res) => {
    try {
        const { album_id, url, type } = req.body;
        const result = await prisma.media.create({
            data: {
                url,
                type: type || 'image',
                album_id: parseInt(album_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.media.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Media deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAlbums, createAlbum, uploadMedia, deleteMedia };
