import express, {Router} from 'express'; 
import { validate } from '../middleware/validate.middleware';
import { validJWTProvided, isAdmin } from '../middleware/auth.middleware';
import { createCarSchema } from '../models/car';

import { 

    getCars, 
    getCarById, 
    createCar, 
    updateCar, 
    deleteCar, 
    getCarValue,

} from '../controllers/car'; 



const router: Router = express.Router(); 

router.get('/', getCars); 
router.get('/value', getCarValue);
router.get('/:id', getCarById); 
router.put('/:id', validJWTProvided, isAdmin, updateCar); 
router.delete('/:id', validJWTProvided, isAdmin, deleteCar); 

router.post('/', validJWTProvided, isAdmin, validate(createCarSchema), createCar);

export default router; 
