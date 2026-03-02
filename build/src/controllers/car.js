"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = exports.updateCar = exports.createCar = exports.getCarById = exports.getCars = void 0;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const car_1 = require("../models/car");
const getCars = async (req, res) => {
    try {
        const cars = (await database_1.collections.cars?.find({}).toArray());
    }
    catch (error) {
        res.status(500).send("oppss");
    }
};
exports.getCars = getCars;
const getCarById = async (req, res) => {
    //get a single car by ID from the database 
    let id = req.params.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const car = (await database_1.collections.cars?.findOne(query));
        if (car) {
            res.status(200).send(car);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
};
exports.getCarById = getCarById;
const createCar = async (req, res) => {
    // create a new car in the database 
    console.log(req.body); //for now still log the data 
    const { make, model, color, yearOfCar } = req.body;
    const newCar = { make: make, model: model, color: color, yearOfCar: new Date(yearOfCar) };
    const validation = car_1.createCarSchema.safeParse(req.body);
    try {
        const result = await database_1.collections.cars?.insertOne(newCar);
        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new car with id ${result.insertedId}` });
        }
        else {
            res.status(500).send("Failed to create a new car.");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error('Unexpected error', error);
        }
        res.status(400).send(`Unable to create new car`);
    }
};
exports.createCar = createCar;
const updateCar = (req, res) => {
    console.log(req.body); //for now just log the data 
    res.json({ "message": `update car ${req.params.id} with data from the post message` });
};
exports.updateCar = updateCar;
const deleteCar = (req, res) => {
    // logic to delete car by ID from the database 
    res.json({ "message": `delete car ${req.params.id} from the database` });
};
exports.deleteCar = deleteCar;
