"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.validJWTProvided = exports.authenticateKey = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticateKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ 'message': 'Unauthorized: API key is missing' });
    }
    next();
};
exports.authenticateKey = authenticateKey;
const validJWTProvided = async (req, res, next) => {
    const authHeader = req.headers?.authorization;
    const tokenFromBearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    const tokenFromAltHeader = req.headers['x-access-token'];
    const tokenFromAlt = typeof tokenFromAltHeader === 'string' ? tokenFromAltHeader : undefined;
    const token = tokenFromBearer ?? tokenFromAlt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: provide Authorization: Bearer <token>' });
    }
    const secret = process.env.JWT_SECRET || "not very secret";
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, secret);
        res.locals.payload = payload;
        return next();
    }
    catch (_err) {
        return res.status(401).json({ message: 'Unauthorized: token is invalid or expired' });
    }
};
exports.validJWTProvided = validJWTProvided;
const isAdmin = async (req, res, next) => {
    const role = res.locals?.payload?.role;
    if (role && role === 'admin') {
        next();
        return;
    }
    res.status(403).json({ message: 'Not authorised' });
};
exports.isAdmin = isAdmin;
