const prisma = require('../config/prisma');

const getVehicles = async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await prisma.transport.findMany({
            where: { institution_id: parseInt(institution_id) },
            include: { transport_routes: true }
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createVehicle = async (req, res) => {
    try {
        const { vehicle_number, driver_name, driver_phone, capacity, route_id, institution_id } = req.body;
        const result = await prisma.transport.create({
            data: {
                vehicle_number,
                driver_name,
                driver_phone,
                capacity: parseInt(capacity),
                route_id: route_id ? parseInt(route_id) : null,
                institution_id: parseInt(institution_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRoutes = async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await prisma.transport_routes.findMany({
            where: { institution_id: parseInt(institution_id) },
            include: { vehicles: true }
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createRoute = async (req, res) => {
    try {
        const { route_name, stops, institution_id } = req.body;
        const result = await prisma.transport_routes.create({
            data: {
                route_name,
                stops,
                institution_id: parseInt(institution_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const assignTransport = async (req, res) => {
    try {
        const { student_id, vehicle_id, institution_id } = req.body;
        const result = await prisma.transport_assign.create({
            data: {
                student_id: parseInt(student_id),
                vehicle_id: parseInt(vehicle_id),
                institution_id: parseInt(institution_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getVehicles, createVehicle, getRoutes, createRoute, assignTransport };
