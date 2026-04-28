const jwt = require('jwt-simple');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Assume req.user is set by authenticateToken
        // Note: For simple setups where frontend might just pass a role header during dev without full tokens, you can check headers too, but req.user is strictly better.
        // As a fallback for this demo without full JWT integration in all frontend fetches, will check body/query role if req.user is missing
        const userRole = req.user?.role || req.headers['x-user-role'] || req.body?.role || 'STUDENT'; 
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                error: 'Access Denied', 
                message: `This action requires one of the following roles: ${allowedRoles.join(', ')}` 
            });
        }
        next();
    };
};

module.exports = { authenticateToken, requireRole };
