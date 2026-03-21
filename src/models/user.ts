import { ObjectId } from "mongodb"; 
import Joi from "joi";

export enum Role {
  admin = 'admin',
  user = 'user',
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
  password: Joi.string().min(1).max(64).required(),
});
