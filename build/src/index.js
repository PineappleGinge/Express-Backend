"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("./router/users"));
const car_1 = __importDefault(require("./router/car"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
(0, database_1.initDb)();
const PORT = process.env.PORT || 3001;
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.get("/ping", async (_req, res) => {
    res.json({
        message: "Hello From Dara O'Rourke 666 - changed",
    });
});
exports.app.use((0, morgan_1.default)("tiny"));
exports.app.get('/bananas', async (_req, res) => res.send('hello world, this is bananas 3'));
exports.app.use(express_1.default.json());
exports.app.use('/api/v1/users', users_1.default);
exports.app.use('/api/v1/cars', car_1.default);
