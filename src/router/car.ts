import express, {Router} from 'express'; 
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
router.put('/:id', updateCar); 
router.delete('/:id', deleteCar); 

router.post('/', validate(createCarSchema), createCar);

export default router; 
