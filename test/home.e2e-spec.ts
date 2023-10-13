import { NotFoundException } from '@nestjs/common';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { HomeModule } from 'src/home/home.module';

describe('Home', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HomeModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it(`list all homes`, async () => {
    const request = await app.inject({
      method: 'GET',
      url: 'home',
    });

    expect(request.statusCode).toEqual(200);
    expect(request.payload).toBeDefined();
  });

  it('get a specific home when not yet created', async () => {
    const request = await app.inject({
      method: 'GET',
      url: 'home/1',
    });

    expect(request.statusCode).toEqual(404);
    expect(JSON.parse(request.payload)).toEqual({
      message: 'No home found with id 1',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it(`create a new home`, async () => {
    const request = await app.inject({
      method: 'POST',
      url: 'home',
      payload: {
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      },
    });

    expect(request.statusCode).toEqual(201);
    expect(request.payload).toBeDefined();
  });

  it(`update an existing home`, async () => {
    const request = await app.inject({
      method: 'PUT',
      url: 'home/1',
      payload: {
        address: '456 Oak St',
        city: 'Othertown',
        state: 'NY',
        zip: '67890',
      },
    });

    expect(request.statusCode).toEqual(200);
    expect(request.payload).toBeDefined();
  });

  it(`delete an existing home`, async () => {
    const request = await app.inject({
      method: 'DELETE',
      url: 'home/1',
    });

    expect(request.statusCode).toEqual(200);
    expect(request.payload).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
