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
const user_1 = require("../models/user");
const argon2 = __importStar(require("argon2"));
const jsonwebtoken_1 = require("jsonwebtoken");
const DEFAULT_ADMIN_EMAIL = 'joe99@gmail.com';
const createAccessToken = (user) => {
    const secret = process.env.JWT_SECRET || "not very secret";
    const expiresTime = '2h';
    const normalizedTokenEmail = typeof user?.email === 'string' ? user.email.trim().toLowerCase() : '';
    const tokenRole = normalizedTokenEmail === DEFAULT_ADMIN_EMAIL ? user_1.Role.admin : user?.role;
    console.log(expiresTime);
    const payload = {
        email: user?.email,
        name: user?.name,
        role: tokenRole
    };
    const token = (0, jsonwebtoken_1.sign)(payload, secret, { expiresIn: expiresTime });
    return token;
};
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const dummyHash = await argon2.hash("time wasting");
    const normalizedEmailInput = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPasswordInput = typeof password === 'string' ? password.trim() : '';
    if (!normalizedEmailInput || !normalizedPasswordInput) {
        res
            .status(400)
            .json({ message: 'Email and password are required' });
        return;
    }
    const normalizedEmail = normalizedEmailInput;
    let user = await database_1.collections.users?.findOne({
        email: normalizedEmail,
    });
    if (!user && normalizedEmail === DEFAULT_ADMIN_EMAIL) {
        const hashedPassword = await argon2.hash(normalizedPasswordInput);
        const bootstrapAdmin = {
            email: normalizedEmail,
            name: 'Joe Admin',
            phonenumber: '0000000000',
            role: user_1.Role.admin,
            hashedPassword,
            dateJoined: new Date(),
            lastUpdated: new Date(),
        };
        await database_1.collections.users?.insertOne(bootstrapAdmin);
        user = await database_1.collections.users?.findOne({ email: normalizedEmail });
    }
    if (user) {
        let isPasswordValid = false;
        let shouldMigrateLegacyPassword = false;
        if (user.hashedPassword) {
            isPasswordValid = await argon2.verify(user.hashedPassword, normalizedPasswordInput);
        }
        else if (typeof user.password === 'string') {
            // Backward compatibility for legacy records that still store plain passwords.
            isPasswordValid = user.password === normalizedPasswordInput;
            shouldMigrateLegacyPassword = isPasswordValid;
        }
        if (isPasswordValid) {
            const userForToken = { ...user };
            const updateSet = { lastUpdated: new Date() };
            const updateUnset = {};
            if (normalizedEmail === DEFAULT_ADMIN_EMAIL && userForToken.role !== user_1.Role.admin) {
                userForToken.role = user_1.Role.admin;
                updateSet.role = user_1.Role.admin;
            }
            if (shouldMigrateLegacyPassword) {
                const newHashedPassword = await argon2.hash(normalizedPasswordInput);
                userForToken.hashedPassword = newHashedPassword;
                updateSet.hashedPassword = newHashedPassword;
                updateUnset.password = '';
            }
            if (Object.keys(updateSet).length > 0 || Object.keys(updateUnset).length > 0) {
                await database_1.collections.users?.updateOne({ email: normalizedEmail }, {
                    ...(Object.keys(updateSet).length > 0 ? { $set: updateSet } : {}),
                    ...(Object.keys(updateUnset).length > 0 ? { $unset: updateUnset } : {}),
                });
            }
            res.status(201).json({ accessToken: createAccessToken(userForToken) });
            return;
        }
        res.status(401).json({
            message: 'Invalid email or password!'
        });
        return;
    }
    // if here the user was not found or there was no hashedpassword.
    // the code below is so that the time taken will be roughly the same if the
    // password is incorrect or if the user does not exist.
    await argon2.verify(dummyHash, normalizedPasswordInput);
    res.status(401).json({
        message: 'Invalid email or password!'
    });
};
exports.handleLogin = handleLogin;
