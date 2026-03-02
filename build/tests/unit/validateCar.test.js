"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const car_1 = require("../../src/models/car");
describe('Date of Birth Validation', () => {
    it('should pass for the following valid dates', () => {
        const validDates = [
            '1970/01/01',
            '1987/12/03',
            '1987-11-30',
        ];
        validDates.forEach((yearOfCar) => {
            expect(() => car_1.createCarSchema.parse(yearOfCar));
        });
    });
    it('should fail for invalid Dates', () => {
        const invalidDates = [
            '2026ty/01/02', // wrong year
            '2000/13/01', // wrong month
            '09/10/2026', // in the future
            '1st march 20121', // wrong date
            'blah balh', // wrong wrong wrong
        ];
        invalidDates.forEach((date) => {
            expect(() => car_1.createCarSchema.parse(date));
        });
    });
    it('should fail when color is not in enum', () => {
        const invalidColors = [
            'cyan',
            'magenta',
            'turquoise',
            'maroon',
            'lavender',
        ];
        invalidColors.forEach((color) => {
            expect(() => car_1.createCarSchema.parse(color));
        });
    });
    it('should fail when make is not in enum', () => {
        const invalidMakes = [
            'Ferrari',
            'Lamborghini',
            'Rolls Royce',
            'Bentley',
            'Maserati',
        ];
        invalidMakes.forEach((make) => {
            expect(() => car_1.createCarSchema.parse(make));
        });
    });
});
