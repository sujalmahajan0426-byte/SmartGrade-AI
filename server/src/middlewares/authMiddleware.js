import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseHelper.js';
import { getUserById } from '../services/userService.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return sendError(res, 401, 'Access token required', 'NO_TOKEN');
        }

        const secret = process.env.JWT_SECRET || 'super-secret-smartgrade-key-12345';
        const decoded = jwt.verify(token, secret);

        const user = await getUserById(decoded.id);
        if (!user) {
            return sendError(res, 401, 'User no longer exists', 'USER_NOT_FOUND');
        }

        req.user = user;
        next();
    } catch (err) {
        return sendError(res, 403, 'Invalid or expired token', 'INVALID_TOKEN');
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return sendError(res, 403, 'Access denied: unauthorized role', 'UNAUTHORIZED_ROLE');
        }
        next();
    };
};
