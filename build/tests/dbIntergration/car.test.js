"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../src/index");
const database_1 = require("../../src/database");
describe('Car API', () => {
    let carId;
    const newCar = {
        "make": "Opel",
        "model": "Astra",
        "color": "Silver",
        "yearOfCar": "2021/05/20",
    };
    test('should create a car and return Location header', async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .post('/api/v1/cars')
            .send(newCar)
            .expect(201);
        const location = res.header['location'];
        carId = location;
        expect(carId).toBeDefined();
    });
});
beforeAll(async () => {
    await (0, database_1.initDb)();
});
afterAll(async () => {
    await (0, database_1.closeDb)();
});
