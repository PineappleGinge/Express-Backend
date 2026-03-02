import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString: string = (process.env.DB_CONN_STRING || "").trim();
const dbName: string = (process.env.DB_NAME || "wenprog2").trim();

let client: MongoClient | undefined;
let db: Db | undefined;

export const collections: { users?: Collection; cars?: Collection } = {};

if (!connectionString) {
    throw new Error("No connection string in .env");
}

export async function initDb(): Promise<void> {
    try {
        
        client = new MongoClient(connectionString);
        await client.connect();
        db = client.db(dbName);

        collections.users = db.collection("users");
        collections.cars = db.collection("cars");
        console.log("connected to database");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`issue with db connection: ${error.message}`);
            throw error; 
        } else {
            console.error(`unknown error with ${error}`);
            throw new Error(String(error));
        }
    }
}

export async function closeDb(): Promise<void> {
    try {
        if (client) {
            await client.close();
            client = undefined;
            db = undefined;
            console.log("Database connection closed");
        } else {
            console.log("closeDb called but client was not initialized");
        }
    } catch (error) {
        console.error("Error closing DB", error);
    }
}


export function getDb(): Db | undefined {
    return db;
}


 

 