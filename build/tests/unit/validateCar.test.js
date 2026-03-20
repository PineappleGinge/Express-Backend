"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const car_1 = require("../../src/models/car");
describe('Car validation (createCarSchema)', () => {
    it('accepts a valid car payload', () => {
        const payload = {
            make: 'Opel',
            model: 'Astra',
            color: 'silver',
            yearOfCar: '2021-05-20',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.make).toBe(payload.make);
            expect(result.data.model).toBe(payload.model);
            expect(result.data.color).toBe(payload.color);
            expect(result.data.yearOfCar instanceof Date).toBe(true);
        }
    });
    it('rejects payload with invalid make', () => {
        const payload = {
            make: 'Ferrari',
            model: 'F8',
            color: 'red',
            yearOfCar: '2020-01-01',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it('rejects payload with invalid color', () => {
        const payload = {
            make: 'Opel',
            model: 'Corsa',
            color: 'cyan',
            yearOfCar: '2019-03-03',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it('rejects payload when model does not belong to make', () => {
        const payload = {
            make: 'Opel',
            model: 'Mustang',
            color: 'red',
            yearOfCar: '2020-01-01',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it('rejects payload when date cannot be parsed', () => {
        const payload = {
            make: 'Opel',
            model: 'Astra',
            color: 'silver',
            yearOfCar: 'not-a-date',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it('rejects payload when required fields are missing', () => {
        const payload = {
            make: 'Opel',
            color: 'silver',
            yearOfCar: '2021-05-20',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it('allows partial payloads when using partial schema (update)', () => {
        const payload = { color: 'blue' };
        const result = car_1.updateCarSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });
    it('accepts numeric timestamp for yearOfCar (coerced)', () => {
        const ts = Date.now();
        const payload = {
            make: 'Opel',
            model: 'Astra',
            color: 'silver',
            yearOfCar: ts,
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.yearOfCar instanceof Date).toBe(true);
        }
    });
    it('rejects model when not a string', () => {
        const payload = {
            make: 'Opel',
            model: 12345,
            color: 'silver',
            yearOfCar: '2021-05-20',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it('is case-sensitive for color and make enums', () => {
        const payloadColorCase = {
            make: 'Opel',
            model: 'Astra',
            color: 'Silver',
            yearOfCar: '2021-05-20',
        };
        const payloadMakeCase = {
            make: 'opel',
            model: 'Astra',
            color: 'silver',
            yearOfCar: '2021-05-20',
        };
        expect(car_1.createCarSchema.safeParse(payloadColorCase).success).toBe(false);
        expect(car_1.createCarSchema.safeParse(payloadMakeCase).success).toBe(false);
    });
    it('allows extra unknown fields by default', () => {
        const payload = {
            make: 'Opel',
            model: 'Astra',
            color: 'silver',
            yearOfCar: '2021-05-20',
            extra: 'extra field here',
        };
        const result = car_1.createCarSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });
});
