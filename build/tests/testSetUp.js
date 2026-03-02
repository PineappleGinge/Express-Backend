"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/database");
const database_2 = require("../src/database");
beforeAll(async () => {
    console.log('Running bofore all');
    console.log = () => { };
    (0, database_1.initDb)(); // 
    (0, database_2.closeDb)();
});
afterAll(async () => {
    console.log = console.log;
});
