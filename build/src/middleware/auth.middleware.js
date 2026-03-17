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
    if (!authHeader || !authHeader?.startsWith('Bearer')) {
        console.log('no header ' + authHeader);
        res.status(401).send();
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send();
        return;
    }
    const secret = process.env.JWT_SECRET || "not very secret";
    try {
        console.log(token);
        const payload = (0, jsonwebtoken_1.verify)(token, secret);
        res.locals.payload = payload;
        next();
    }
    catch (err) {
        res.status(403).send();
        return;
    }
};
exports.validJWTProvided = validJWTProvided;
const isAdmin = async (req, res, next) => {
    const role = res.locals?.payload?.role;
    console.log('role is ' + role);
    if (role && role === 'admin') {
        next();
        return;
    }
    res.status(403).json({ opps: 'not an admin' });
};
exports.isAdmin = isAdmin;
