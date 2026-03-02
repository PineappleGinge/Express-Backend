import express, {Router} from 'express'; 
import { authenticateKey } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCarSchema } from '../models/car';

import { 

    getCars, 
    getCarById, 
    createCar, 
    updateCar, 
    deleteCar, 

} from '../controllers/car'; 



const router: Router = express.Router(); 

router.get('/', getCars); 
router.get('/:id', getCarById); 
router.post('/', createCar); 
router.put('/:id', updateCar); 
router.delete('/:id', deleteCar); 

router.post('/', validate(createCarSchema), createCar);

export default router; 