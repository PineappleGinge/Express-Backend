"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = void 0;
const database_1 = require("../database");
const argon2 = __importStar(require("argon2"));
const jsonwebtoken_1 = require("jsonwebtoken");
const createAccessToken = (user) => {
    const secret = process.env.JWT_SECRET || "not very secret";
    const expiresTime = '2 mins';
    console.log(expiresTime);
    const payload = {
        email: user?.email,
        name: user?.name,
        role: user?.role
    };
    const token = (0, jsonwebtoken_1.sign)(payload, secret, { expiresIn: expiresTime });
    return token;
};
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const dummyHash = await argon2.hash("time wasting");
    if (!email || !password) {
        res
            .status(400)
            .json({ message: 'Email and password are required' });
        return;
    }
    const user = await database_1.collections.users?.findOne({
        email: email.toLowerCase(),
    });
    if (user && user.hashedPassword) {
        const isPasswordValid = await argon2.verify(user.hashedPassword, password);
        // If password is valid send a token
        if (isPasswordValid) {
            res.status(201).json({ accessToken: createAccessToken(user) });
        }
        else {
            res.status(401).json({
                message: 'Invalid email or password!'
            });
        }
        return;
    }
    // if here the user was not found or there was no hashedpassword.
    // the code below is so that the time taken will be roughly the same if the
    // password is incorrect or if the user does not exist.
    await argon2.verify(dummyHash, password);
    res.status(401).json({
        message: 'Invalid email or password!'
    });
};
exports.handleLogin = handleLogin;
