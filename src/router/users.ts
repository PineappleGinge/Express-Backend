import express, {Router} from 'express'; 
import { authenticateKey, validJWTProvided } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
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
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', updateUser); 
router.delete('/:id', validJWTProvided, deleteUser); 

export default router; 
