import { createUserSchema } from '../../src/models/user';

const validUser = {
    name: 'Una',
    phonenumber: '0871234567',
    email: 'john.doe@mymail.ie',
    dob: '2001/01/12',
};

describe('createUserSchema validation', () => {
    it('accepts a variety of valid date formats for dob', () => {
        const validDates = ['1970-01-01', '1987-12-03', '1987-11-30', '2000-02-29'];

        validDates.forEach((date) => {
            const { error, value } = createUserSchema.validate({ ...validUser, dob: date });
            expect(error).toBeUndefined();
            expect(value.dob instanceof Date).toBe(true);
        });
    });

    it('rejects unparsable dob strings', () => {
        const badDates = ['not-a-date', '2026ty/01/02', '1st march 20121', ''];

        badDates.forEach((date) => {
            const { error } = createUserSchema.validate({ ...validUser, dob: date });
            expect(error).toBeDefined();
        });
    });

    it('rejects invalid email addresses', () => {
        const payload = { ...validUser, email: 'not-an-email' };
        const { error } = createUserSchema.validate(payload);
        expect(error).toBeDefined();
    });

    it('accepts valid email and password', () => {
        const payload = { ...validUser, email: 'valid@example.com', password: 'StrongPass123!' };
        const { error, value } = createUserSchema.validate(payload);
        expect(error).toBeUndefined();
        expect(value.email).toBe('valid@example.com');
        expect(value.password).toBe('StrongPass123!');
    });

    it('rejects passwords longer than 64 characters', () => {
        const payload = { ...validUser, password: 'a'.repeat(65) };
        const { error } = createUserSchema.validate(payload);
        expect(error).toBeDefined();
    });

    it('rejects when required fields are missing', () => {
        const missingName = { ...validUser } as any;
        delete missingName.name;

        const missingEmail = { ...validUser } as any;
        delete missingEmail.email;

        const missingPhone = { ...validUser } as any;
        delete missingPhone.phonenumber;

        expect(createUserSchema.validate(missingName).error).toBeDefined();
        expect(createUserSchema.validate(missingEmail).error).toBeDefined();
        expect(createUserSchema.validate(missingPhone).error).toBeDefined();
    });

    it('coerces dob into a Date object', () => {
        const payload = { ...validUser, dob: '1995-07-20' };
        const { error, value } = createUserSchema.validate(payload);
        expect(error).toBeUndefined();
        expect(value.dob instanceof Date).toBe(true);
        expect(value.dob.toISOString().startsWith('1995-07-20')).toBe(true);
    });

    it('rejects empty name', () => {
        const payload = { ...validUser, name: '' };
        const { error } = createUserSchema.validate(payload);
        expect(error).toBeDefined();
    });

    it('rejects numeric phonenumber (must be string)', () => {
        const payload = { ...validUser, phonenumber: 871234567 } as any;
        const { error } = createUserSchema.validate(payload);
        expect(error).toBeDefined();
    });

    it('allows extra unknown fields by default', () => {
        const payload = { ...validUser, extra: 'this is fine' } as any;
        const { error, value } = createUserSchema.validate(payload, { stripUnknown: true });
        expect(error).toBeUndefined();
        expect((value as any).extra).toBeUndefined();
    });

    it('accepts numeric timestamp for dob (coerced)', () => {
        const ts = Date.now();
        const payload = { ...validUser, dob: ts } as any;
        const { error, value } = createUserSchema.validate(payload);
        expect(error).toBeUndefined();
        expect(value.dob instanceof Date).toBe(true);
    });

    it('accepts future dob values (schema does not enforce past dates)', () => {
        const payload = { ...validUser, dob: '2100-01-01' };
        const { error } = createUserSchema.validate(payload);
        expect(error).toBeUndefined();
    });

    it('partial schema accepts partial payloads', () => {
        const partial = createUserSchema.fork(['name', 'phonenumber', 'email', 'dob', 'password'], (schema) => schema.optional());
        const payload = { email: 'partial@example.com' };
        const { error } = partial.validate(payload);
        expect(error).toBeUndefined();
    });
});
