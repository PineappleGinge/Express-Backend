"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCarSchema = exports.Make = exports.Color = void 0;
const zod_1 = require("zod");
var Color;
(function (Color) {
    Color["Black"] = "black";
    Color["White"] = "white";
    Color["Silver"] = "silver";
    Color["Gray"] = "gray";
    Color["Red"] = "red";
    Color["Blue"] = "blue";
    Color["Green"] = "green";
    Color["Yellow"] = "yellow";
    Color["Orange"] = "orange";
    Color["Brown"] = "brown";
    Color["Beige"] = "beige";
    Color["Gold"] = "gold";
    Color["Purple"] = "purple";
    Color["Pink"] = "pink";
    Color["Teal"] = "teal";
})(Color || (exports.Color = Color = {}));
var Make;
(function (Make) {
    Make["Opel"] = "Opel";
    Make["Ford"] = "Ford";
    Make["BMW"] = "BMW";
    Make["Audi"] = "Audi";
    Make["Toyota"] = "Toyota";
    Make["Honda"] = "Honda";
    Make["Chevrolet"] = "Chevrolet";
    Make["Nissan"] = "Nissan";
    Make["Volkswagen"] = "Volkswagen";
    Make["Mercedes"] = "Mercedes";
    Make["Hyundai"] = "Hyundai";
    Make["Kia"] = "Kia";
    Make["Subaru"] = "Subaru";
    Make["Mazda"] = "Mazda";
    Make["Lexus"] = "Lexus";
})(Make || (exports.Make = Make = {}));
exports.createCarSchema = zod_1.z.object({
    make: zod_1.z.enum([
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
    model: zod_1.z.string(),
    color: zod_1.z.enum([
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
    yearOfCar: zod_1.z.coerce.date(),
});
