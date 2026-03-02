"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const getUsers = async (req, res) => {
    try {
        const users = (await database_1.collections.users?.find({}).toArray());
    }
    catch (error) {
        res.status(500).send("oppss");
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    //get a single  user by ID from the database 
    let id = req.params.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const user = (await database_1.collections.users?.findOne(query));
        if (user) {
            res.status(200).send(user);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    // create a new user in the database 
    console.log(req.body); //for now still log the data 
    const newUser = req.body; // note this is not a secure practice but will do for now. 
    try {
        const result = await database_1.collections.users?.insertOne(newUser);
        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` });
        }
        else {
            res.status(500).send("Failed to create a new user.");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(`Unable to create new user`);
    }
};
exports.createUser = createUser;
const updateUser = (req, res) => {
    console.log(req.body); //for now just log the data 
    res.json({ "message": `update user ${req.params.id} with data from the post message` });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    // logic to delete user by ID from the database 
    res.json({ "message": `delete user ${req.params.id} from the database` });
};
exports.deleteUser = deleteUser;
