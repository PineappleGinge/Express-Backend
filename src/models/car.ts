import { ObjectId } from "mongodb"; 
import { z } from "zod";

export enum Color {
  Black = "black",
  White = "white",
  Silver = "silver",
  Gray = "gray",
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Orange = "orange",
  Brown = "brown",
  Beige = "beige",
  Gold = "gold",
  Purple = "purple",
  Pink = "pink",
  Teal = "teal",
}

export enum Make{
  Opel = "Opel",
  Ford = "Ford",
  BMW = "BMW",
  Audi = "Audi",
  Toyota = "Toyota",
  Honda = "Honda",
  Chevrolet = "Chevrolet",
  Nissan = "Nissan",
  Volkswagen = "Volkswagen",
  Mercedes = "Mercedes",
  Hyundai = "Hyundai",
  Kia = "Kia",
  Subaru = "Subaru",
  Mazda = "Mazda",
  Lexus = "Lexus",
}

export interface Car { 
  id?: ObjectId; 
  make: Make; 
  model: string; 
  color: Color; 
  yearOfCar?: Date;
}

export const createCarSchema = z.object({
  make: z.enum([
    Make.Opel,
    Make.Ford,
    Make.BMW,
    Make.Audi,
    Make.Toyota,
    Make.Honda,
    Make.Chevrolet,
    Make.Nissan,
    Make.Volkswagen,
    Make.Mercedes,
    Make.Hyundai,
    Make.Kia,
    Make.Subaru,
    Make.Mazda,
    Make.Lexus,
  ]),
  model: z.string(),
  color: z.enum([
    Color.Black,
    Color.White,
    Color.Silver,
    Color.Gray,
    Color.Red,
    Color.Blue,
    Color.Green,
    Color.Yellow,
    Color.Orange,
    Color.Brown,
    Color.Beige,
    Color.Gold,
    Color.Purple,
    Color.Pink,
    Color.Teal,
  ]),
  yearOfCar: z.coerce.date(),
});
