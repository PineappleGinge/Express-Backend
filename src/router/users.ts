import express, {Router} from 'express'; 
import { validate } from '../middleware/validate.middleware';
import { validJWTProvided, isAdmin } from '../middleware/auth.middleware';
import { createUserSchema } from '../models/user';

import { 

    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 

} from '../controllers/users'; 



const router: Router = express.Router(); 

router.get('/', getUsers); 
router.get('/:id', getUserById); 
router.post('/', validJWTProvided, isAdmin, validate(createUserSchema), createUser);
router.put('/:id', validJWTProvided, isAdmin, updateUser); 
router.delete('/:id', validJWTProvided, isAdmin, deleteUser); 

export default router; 
