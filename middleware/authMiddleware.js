const jwt = require('jsonwebtoken');
const authAdminMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ "error": "Authorization header missing or invalid" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({ "error": "Access denied. Admins only" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ 'error': "Invalid or expired token" });
    }
};

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ "error": "Authorization header missing or invalid" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ 'error': "Invalid or expired token" });
    }
};

module.exports = {authAdminMiddleware, authMiddleware};
