"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateKey = void 0;
const authenticateKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ 'message': 'Unauthorized: API key is missing' });
    }
    next();
};
exports.authenticateKey = authenticateKey;
