import { Request, Response } from 'express'; 
import { collections } from '../database'; 
import { Car } from '../models/car' ;
import { ObjectId } from 'mongodb';
import { createCarSchema, isModelValidForMake, Make } from '../models/car';

export const getCars = async (req: Request, res: Response) => {
  try {
    const cars = await collections.cars?.find({}).toArray();

    const cleanCars = cars?.map(c => ({
      ...c,
      _id: c._id.toString(),
    }));

    res.status(200).json(cleanCars);
  } catch (error) {
    res.status(500).send("Error fetching cars");
  }
};


export const getCarById = async (req: Request, res: Response) => { 

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).send("Missing car id");
    }

    try { 
        const query = { _id: new ObjectId(id) }; 
        const car = (await collections.cars?.findOne(query)) as unknown as Car; 
        if (car) { 
            res.status(200).send(car); 
        }
        else { 
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`); 
        } 
    } catch (error) { 
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`); 
    } 
}; 

export const createCar = async (req: Request, res: Response) => { 
   
    console.log(req.body); 
    const {make, model, color, yearOfCar} = req.body;
  
    const newCar : Car = {make : make, model: model, color: color, yearOfCar : new Date(yearOfCar)}

    const validation = createCarSchema.safeParse(req.body);

    if (!validation.success) { 
        return res.status(400).json({ errors: validation.error.issues }); 
    }
    try { 
        const result = await collections.cars?.insertOne(newCar) 

        if (result) { 
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new car with id ${result.insertedId}` }) 
        }   
        else { 
            res.status(500).send("Failed to create a new car."); 
        } 
    } 
    catch (error) { 
        if (error instanceof Error) { 
            console.error(error.message); 
        } else { 
            console.error('Unexpected error', error); 
        }
        res.status(400).send(`Unable to create new car`);
    } 
}; 

export const updateCar = async (req: Request, res: Response) => {
    
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).send("Missing car id");
    }

    const partialSchema = createCarSchema.partial();
    const validation = partialSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.issues });
    }
    try {
        const query = { _id: new ObjectId(id) };
        const existingCar = await collections.cars?.findOne(query);
        if (!existingCar) {
            return res.status(404).send(`Unable to find matching document with id: ${id}`);
        }

        const updateData: any = { ...req.body };
        const makeForValidation = (updateData.make ?? existingCar.make) as Make;
        const modelForValidation = (updateData.model ?? existingCar.model) as string;

        if (!isModelValidForMake(makeForValidation, modelForValidation)) {
            return res.status(400).json({
                errors: [
                    {
                        path: ['model'],
                        message: `Model "${modelForValidation}" is not valid for make "${makeForValidation}"`,
                    },
                ],
            });
        }

        if (updateData.yearOfCar) {
            updateData.yearOfCar = new Date(updateData.yearOfCar);
        }
        const result = await collections.cars?.updateOne(query, { $set: updateData });

        if (!result) {
            return res.status(500).send('Failed to update car.');
        }
        return res.status(200).json({ message: `Successfully updated car with id ${id}` });
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Unable to update car: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const deleteCar = async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).send("Missing car id");
    }

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.cars?.deleteOne(query);

        if (!result) {
            return res.status(500).send('Failed to delete car.');
        }

        if ((result as any).deletedCount === 0) {
            return res.status(404).send(`Unable to find matching document with id: ${id}`);
        }

        return res.status(200).json({ message: `Successfully deleted car with id ${id}` });
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Unable to delete car: ${error instanceof Error ? error.message : String(error)}`);
    }
};
    
