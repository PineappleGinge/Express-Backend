"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../src/index");
const database_1 = require("../../src/database");
describe('User API', () => {
    let userId;
    const newUser = {
        "name": "Una",
        "phonenumber": "0871234567",
        "email": "john.doe@mymail.ie",
        "dob": "2001/01/12",
    };
    test('should create a user and return Location header', async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .post('/api/v1/users')
            .send(newUser)
            .expect(201);
        const location = res.header['location'];
        userId = location;
        expect(userId).toBeDefined();
    });
});
beforeAll(async () => {
    await (0, database_1.initDb)();
});
afterAll(async () => {
    await (0, database_1.closeDb)();
});
