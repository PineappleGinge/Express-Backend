import { Request, Response, NextFunction } from 'express';
import { collections } from '../../src/database';
import { createUser } from '../../src/controllers/users';
import { validate } from '../../src/middleware/validate.middleware';
import { createUserSchema } from '../../src/models/user';

const buildRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.location = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response & {
    status: jest.Mock;
    json: jest.Mock;
    location: jest.Mock;
    send: jest.Mock;
  };
};
//
const validBody = {
  name: 'Test User',
  phonenumber: '0871234567',
  email: 'test@example.com',
  dob: '1990-01-01',
  password: 'StrongPass123!',
};

describe('createUser controller POST validations', () => {
  const runValidate = validate(createUserSchema);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    collections.users = undefined;
  });

  it('returns 400 when email is missing', async () => {
    const req = { body: { ...validBody } } as Request;
    delete (req.body as any).email;
    const res = buildRes();
    const next: NextFunction = jest.fn();

    await runValidate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when password is missing', async () => {
    const req = { body: { ...validBody } } as Request;
    delete (req.body as any).password;
    const res = buildRes();
    const next: NextFunction = jest.fn();

    await runValidate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    collections.users = {
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
    } as any;

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Password is required' });
  });

  it('returns 400 for badly formed email', async () => {
    const req = { body: { ...validBody, email: 'not-an-email' } } as Request;
    const res = buildRes();
    const next: NextFunction = jest.fn();

    await runValidate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when email already exists', async () => {
    const req = { body: { ...validBody } } as Request;
    const res = buildRes();
    const next: NextFunction = jest.fn();

    await runValidate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    const findOne = jest.fn().mockResolvedValue({ _id: 'existing-user' });
    const insertOne = jest.fn();
    collections.users = { findOne, insertOne } as any;

    await createUser(req, res);

    expect(findOne).toHaveBeenCalledWith({ email: validBody.email });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'existing email' });
    expect(insertOne).not.toHaveBeenCalled();
  });
});
