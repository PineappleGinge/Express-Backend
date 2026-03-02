"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("./router/users"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const auth_middleware_1 = require("./middleware/auth.middleware"); //middleware
(0, database_1.initDb)();
const PORT = process.env.PORT || 3000;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use('/api/v1/users', auth_middleware_1.authenticateKey, users_1.default);
app.get("/ping", async (_req, res) => {
    res.json({
        message: "Hello From Dara O'Rourke 666 - changed",
    });
});
app.use((0, morgan_1.default)("tiny"));
app.get('/bananas', async (_req, res) => res.send('hello world, this is bananas 2'));
app.use(express_1.default.json());
app.use('/api/v1/users', users_1.default);
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
