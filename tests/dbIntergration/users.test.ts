import request from 'supertest';
import { app } from '../../src/index';
import { sign as jwtSign } from 'jsonwebtoken';

jest.setTimeout(10000);

describe('User API', () => {
  let userId: string;
  let adminToken: string;
  let newUser: any;
  
  beforeAll(() => {
    adminToken = jwtSign(
      { email: 'integration-admin@test.local', role: 'admin' },
      process.env.JWT_SECRET || 'not very secret',
      { expiresIn: '1h' }
    );

    newUser = {
      name: "Una",
      phonenumber: "0871234567",
      email: `john.doe+${Date.now()}@mymail.ie`,
      dob: "2001/01/12",
      password: "StrongPass123!",
    };
  });
  test('should create a user and return Location header', async () => {

    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUser)
      .expect(201);

    const location = res.header['location'];

    userId = location;
    expect(userId).toBeDefined();
  });

  test('should get the created user by id', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${userId}`)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
  });

  test('should handle update request (returns json message)', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });
  test('should list users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    // at least one user (the one we created)
    const found = res.body.some((u: any) => u.email === newUser.email);
    expect(found).toBe(true);
  });

  test('should update user and persist change', async () => {
    await request(app)
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })
      .expect(200);

    const getRes = await request(app).get(`/api/v1/users/${userId}`).expect(200);
    expect(getRes.body.name).toBe('Updated Name');
  });

  test('should delete the user and return 404 afterwards', async () => {
    await request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app)
      .get(`/api/v1/users/${userId}`)
      .expect(404);
  });

  test('should return 400 for invalid create payload', async () => {
    const bad = { name: 'NoEmail', phonenumber: '0870000000', dob: '2000-01-01' };
    await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(bad)
      .expect(400);
  });

  test('should return 404 for malformed id', async () => {
    await request(app)
      .get('/api/v1/users/invalid-id')
      .expect(404);
  });
});

afterAll(async () => {
});
