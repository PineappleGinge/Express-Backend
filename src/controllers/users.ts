import { Request, Response } from 'express'; 
import { collections } from '../database'; 
import { ObjectId } from 'mongodb';
import argon2 from 'argon2';

export const getUsers = async (req: Request, res: Response) => { 
    try {
        const users = await collections.users
            ?.find({})
            .project({ hashedPassword: 0 })
            .toArray();
        res.status(200).json(users);
    } catch (error) { 
        console.error(error);
        res.status(500).send("Error fetching users");
    } 
};


export const getUserById = async (req: Request, res: Response) => { 

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).send("Missing user id");
    }

    try { 
        const query = { _id: new ObjectId(id) }; 
        const user = await collections.users?.findOne(query, {
            projection: { hashedPassword: 0 },
        }); 

        if (user) { 
            return res.status(200).send(user); 
        }

        return res.status(404).send(`Unable to find matching document with id: ${req.params.id}`); 

    } catch (error) { 
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`); 
    } 
}; 

export const createUser = async (req: Request, res: Response) => { 

    console.log(req.body);  
    const {name, phonenumber, email, dob, password} = req.body;
    const normalizedEmail = email?.toLowerCase();

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try { 
        const existingUser = await collections.users?.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'existing email' });
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = {
            name,
            phonenumber,
            email: normalizedEmail,
            dob: dob ? new Date(dob) : undefined,
            dateJoined: new Date(),
            lastUpdated: new Date(),
            hashedPassword,
        };

        const result = await collections.users?.insertOne(newUser); 

        if (result) { 
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` }); 
        }   
        else { 
            res.status(500).json({ error: "Failed to create a new user." }); 
        } 
    } 
    catch (error) { 
        if (error instanceof Error) { 
            console.error(`issue with inserting ${error.message}`); 
        } else { 
            console.error('Unexpected error', error); 
        }
        
        res.status(500).json({ error: "Failed to create a new user." });
    } 
}; 


export const updateUser = async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).json({ message: "Missing user id" });
    }
    try {
        const query = { _id: new ObjectId(id) };
        const updatedFields = {
            ...req.body,
            dob: req.body.dob ? new Date(req.body.dob) : undefined,
            lastUpdated: new Date(),
        };

        const result = await collections.users?.updateOne(
            query,
            { $set: updatedFields }
        );

        if (!result || result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated" });
    } catch (error) {
        res.status(400).json({ message: "Failed to update user" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        return res.status(400).json({ message: "Missing user id" });
    }
    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.deleteOne(query);

        if (!result || result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete user" });
    }
};
