import { ObjectId } from "mongodb"; 
import Joi from "joi";

export enum Role {
  admin = 'admin',
  editor = 'editor',
  empty = '',
}

export interface User { 

    id?: ObjectId; 
    name: string; 
    phonenumber: string; 
    email: string; 
    dateJoined? : Date;
    lastUpdated?: Date;
    dob?: Date;
    password?: string;
    hashedPassword?: string;
    role?: Role;

} 

export const createUserSchema = Joi.object<User>({
  name: Joi.string().min(3).required(),
  phonenumber: Joi.string().min(10).required(),
  email: Joi.string().email().required(),
  dob: Joi.date().optional(),
  password: Joi.string().max(64).optional(),
  role: Joi.string().valid(Role.admin, Role.editor, Role.empty).optional(),
});
