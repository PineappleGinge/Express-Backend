"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const car_1 = require("../models/car");
const car_2 = require("../controllers/car");
const router = express_1.default.Router();
router.get('/', car_2.getCars);
router.get('/:id', car_2.getCarById);
router.put('/:id', auth_middleware_1.validJWTProvided, auth_middleware_1.isAdmin, car_2.updateCar);
router.delete('/:id', auth_middleware_1.validJWTProvided, auth_middleware_1.isAdmin, car_2.deleteCar);
router.post('/', auth_middleware_1.validJWTProvided, auth_middleware_1.isAdmin, (0, validate_middleware_1.validate)(car_1.createCarSchema), car_2.createCar);
exports.default = router;
