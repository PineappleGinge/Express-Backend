import request from 'supertest';
import { app } from '../../src/index';
import { initDb, closeDb } from '../../src/database';

describe('Car API', () => {
  let carId: string;
  
  const newCar = {
    "make": "Opel",
    "model": "Astra",
    "color": "silver",
    "yearOfCar": "2021-05-20",
  };

  test('should create a car and return Location header', async () => {
    const res = await request(app)
      .post('/api/v1/cars')
      .send(newCar)
      .expect(201);

    const location = res.header['location'];

    carId = location;
    expect(carId).toBeDefined();
  });

  test('should return a list of cars', async () => {
    const res = await request(app)
      .get('/api/v1/cars')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('should get a car by id', async () => {
    const res = await request(app)
      .get(`/api/v1/cars/${carId}`)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.make).toBe(newCar.make);
    expect(res.body.model).toBe(newCar.model);
  });

  test('should update a car partially', async () => {
    const res = await request(app)
      .put(`/api/v1/cars/${carId}`)
      .send({ color: 'blue' })
      .expect(200);

    expect(res.body).toHaveProperty('message');

    
    const getRes = await request(app).get(`/api/v1/cars/${carId}`).expect(200);
    expect(getRes.body.color).toBe('blue');
  });

  test('should return 400 for invalid create payload', async () => {
    
    const badCar = { make: 'NotAMake', model: 123 } as any;

    await request(app)
      .post('/api/v1/cars')
      .send(badCar)
      .expect(400);
  });

  test('should return 404 for non-existing car id', async () => {
    const missingId = '000000000000000000000000';

    await request(app)
      .get(`/api/v1/cars/${missingId}`)
      .expect(404);
  });

  test('should delete a car', async () => {
    await request(app)
      .delete(`/api/v1/cars/${carId}`)
      .expect(200);

    
    await request(app)
      .get(`/api/v1/cars/${carId}`)
      .expect(404);
  });
});

beforeAll(async () => {
  await initDb();
});

afterAll(async () => {
  await closeDb();
});
