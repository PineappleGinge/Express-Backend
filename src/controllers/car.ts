import { Request, Response } from 'express'; 
import { collections } from '../database'; 
import { Car } from '../models/car' ;
import { ObjectId } from 'mongodb';
import { createCarSchema, isModelValidForMake, Make, updateCarSchema } from '../models/car';
import axios from 'axios';

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
   
    const validation = createCarSchema.safeParse(req.body);

    if (!validation.success) { 
        return res.status(400).json({ errors: validation.error.issues }); 
    }
    const { make, model, color, yearOfCar, imageUrl } = validation.data;

    const newCar: Car = {
        make,
        model,
        color,
        yearOfCar,
        imageUrl,
    };
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

    const validation = updateCarSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.issues });
    }
    try {
        const query = { _id: new ObjectId(id) };
        const existingCar = await collections.cars?.findOne(query);
        if (!existingCar) {
            return res.status(404).send(`Unable to find matching document with id: ${id}`);
        }

        const updateData: any = { ...validation.data };
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

        if (updateData.yearOfCar !== undefined) {
            updateData.yearOfCar = Number(updateData.yearOfCar);
            const currentYear = new Date().getFullYear();
            if (!Number.isInteger(updateData.yearOfCar) || updateData.yearOfCar < 1886 || updateData.yearOfCar > currentYear + 1) {
                return res.status(400).json({
                    errors: [
                        {
                            path: ['yearOfCar'],
                            message: `yearOfCar must be an integer between 1886 and ${currentYear + 1}`,
                        },
                    ],
                });
            }
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

export const getCarValue = async (req: Request, res: Response) => {
    const { make, model, year } = req.query;

    if (!make || !model || !year) {
        return res.status(400).json({ message: 'Missing required query params: make, model, year' });
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_HOST;

    if (!rapidApiKey || !rapidApiHost) {
        return res.status(500).json({ message: 'RapidAPI credentials are not configured' });
    }

    try {
        const response = await axios.get(
            'https://vehicle-pricing-api.p.rapidapi.com/2775/get%2Bvehicle%2Bvalue',
            {
                params: {
                    maker: String(make),
                    model: String(model),
                    year: String(year),
                },
                headers: {
                    'x-rapidapi-key': rapidApiKey,
                    'x-rapidapi-host': rapidApiHost,
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Vehicle pricing API error:', error);
        return res.status(500).json({ message: 'Failed to fetch vehicle pricing data' });
    }
};
    
