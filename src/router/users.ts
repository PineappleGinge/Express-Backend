import express, {Router} from 'express'; 
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
router.delete('/:id', deleteUser); 

export default router; 
