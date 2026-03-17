"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.Role = void 0;
const joi_1 = __importDefault(require("joi"));
var Role;
(function (Role) {
    Role["admin"] = "admin";
    Role["editor"] = "editor";
    Role["empty"] = "";
})(Role || (exports.Role = Role = {}));
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    phonenumber: joi_1.default.string().min(10).required(),
    email: joi_1.default.string().email().required(),
    dob: joi_1.default.date().optional(),
    password: joi_1.default.string().max(64).optional(),
    role: joi_1.default.string().valid(Role.admin, Role.editor, Role.empty).optional(),
});
