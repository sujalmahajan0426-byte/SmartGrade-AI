import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findByEmail } from '../services/userService.js';
import { sendResponse, sendError } from '../utils/responseHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-smartgrade-key-12345';

export const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password || !name) {
            return sendError(res, 400, 'Name, email, and password are required', 'MISSING_FIELDS');
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const existingUser = await findByEmail(normalizedEmail);
        if (existingUser) {
            return sendError(res, 400, 'An account with this email already exists', 'USER_EXISTS');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Normalize role (STUDENT, TEACHER, PARENT)
        const validRoles = ['STUDENT', 'TEACHER', 'PARENT'];
        const normalizedRole = role && validRoles.includes(role.toUpperCase()) ? role.toUpperCase() : 'STUDENT';

        const user = await createUser({
            email: normalizedEmail,
            password: hashedPassword,
            name: name.trim(),
            role: normalizedRole,
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return sendResponse(res, 201, {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.toLowerCase(),
            token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return sendError(res, 500, error.message);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 400, 'Email and password are required', 'MISSING_FIELDS');
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await findByEmail(normalizedEmail);

        if (!user) {
            return sendError(res, 401, 'Invalid email or password', 'AUTH_FAILED');
        }

        // Compare password (support both bcrypt hash and plain-text fallback during transition)
        let isMatch = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = user.password === password;
        }

        if (!isMatch) {
            return sendError(res, 401, 'Invalid email or password', 'AUTH_FAILED');
        }

        // Generate real JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return sendResponse(res, 200, {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.toLowerCase(),
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return sendError(res, 500, error.message);
    }
};

export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return sendError(res, 401, 'Not authenticated', 'UNAUTHENTICATED');
        }

        return sendResponse(res, 200, {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role.toLowerCase(),
            enrollments: req.user.enrollments || [],
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};
