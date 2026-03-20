import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import userRoutes from './router/users';
import carRoutes from './router/car';
import authRoutes from './router/auth';
import dotenv from 'dotenv';
import { dot } from "node:test/reporters";
import { initDb } from "./database";
import { authenticateKey } from "./middleware/auth.middleware"; //middleware
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

if (process.env.NODE_ENV !== 'test') {
    initDb().catch((error) => {
        console.error('Failed to initialize database connection', error);
    });
}

const PORT = process.env.PORT || 3000;

dotenv.config();

export const app: Application = express();

app.get("/ping", async (_req: Request, res: Response) => {

    res.json({

        message: "Hello From Dara O'Rourke 666 - changed",

    });
});

app.use(morgan("tiny"));

app.use(cors())

app.get('/bananas', async (_req: Request, res: Response) =>
    res.send('hello world, this is bananas 3'));

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/auth', authRoutes);

// Serve the OpenAPI YAML file and Swagger UI at /docs
app.get('/openapi.yaml', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'openapi.yaml'));
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl: '/openapi.yaml' }));
