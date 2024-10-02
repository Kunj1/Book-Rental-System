import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Book Controller', () => {
  it('should create a new book', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        name: 'Test Book',
        category: 'Fiction',
        rentPerDay: 50
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Book');
  });

  it('should get all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});