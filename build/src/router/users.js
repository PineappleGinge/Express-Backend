"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_1 = require("../models/user");
const users_1 = require("../controllers/users");
const router = express_1.default.Router();
router.get('/', users_1.getUsers);
router.get('/:id', users_1.getUserById);
router.post('/', users_1.createUser);
router.put('/:id', users_1.updateUser);
router.delete('/:id', users_1.deleteUser);
router.post('/', (0, validate_middleware_1.validate)(user_1.createUserSchema), users_1.createUser);
exports.default = router;
