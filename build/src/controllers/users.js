"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const argon2_1 = __importDefault(require("argon2"));
const getUsers = async (req, res) => {
    try {
        const users = await database_1.collections.users
            ?.find({})
            .project({ hashedPassword: 0 })
            .toArray();
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error fetching users");
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).send("Missing user id");
    }
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const user = await database_1.collections.users?.findOne(query, {
            projection: { hashedPassword: 0 },
        });
        if (user) {
            return res.status(200).send(user);
        }
        return res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
    catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    console.log(req.body);
    const { name, phonenumber, email, dob, password } = req.body;
    const normalizedEmail = email?.toLowerCase();
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    try {
        const existingUser = await database_1.collections.users?.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'existing email' });
        }
        const hashedPassword = await argon2_1.default.hash(password);
        const newUser = {
            name,
            phonenumber,
            email: normalizedEmail,
            dob: dob ? new Date(dob) : undefined,
            dateJoined: new Date(),
            lastUpdated: new Date(),
            hashedPassword,
        };
        const result = await database_1.collections.users?.insertOne(newUser);
        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` });
        }
        else {
            res.status(500).json({ error: "Failed to create a new user." });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`issue with inserting ${error.message}`);
        }
        else {
            console.error('Unexpected error', error);
        }
        res.status(500).json({ error: "Failed to create a new user." });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).json({ message: "Missing user id" });
    }
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const updatedFields = {
            ...req.body,
            dob: req.body.dob ? new Date(req.body.dob) : undefined,
            lastUpdated: new Date(),
        };
        const result = await database_1.collections.users?.updateOne(query, { $set: updatedFields });
        if (!result || result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated" });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update user" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).json({ message: "Missing user id" });
    }
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = await database_1.collections.users?.deleteOne(query);
        if (!result || result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
