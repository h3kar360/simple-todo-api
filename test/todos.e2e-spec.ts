import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('TodosController (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let todoId: string;
  const TODOS_URL: string = '/api/v1/todos';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();

    // login first to be able to pass through auth guard
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser',
        password: 'testuser123',
      });

    accessToken = loginResponse.body.accessToken;
  });

  describe('Creating New Todo POST /api/v1/todos', () => {
    it('should create a new todo for testuser', async () => {
      const response = await request(app.getHttpServer())
        .post(TODOS_URL)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'fetch the kids',
        })
        .expect(201);

      todoId = response.body.id;
    });

    it('should fail to create new todo because unauthorized', async () => {
      await request(app.getHttpServer())
        .post(TODOS_URL)
        .send({
          title: 'fetch the kids',
        })
        .expect(401);
    });
  });

  describe('Get All Todo For User testuser GET /api/v1/todos', () => {
    it('should get all the todos of testuser', async () => {
      await request(app.getHttpServer())
        .get(TODOS_URL)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should be unauthorized to get any todos', async () => {
      await request(app.getHttpServer()).get(TODOS_URL).expect(401);
    });
  });

  describe('update the contents of a certain todo of testuser PUT /api/v1/todos/:id', () => {
    it('should only update isCompleted to true', async () => {
      await request(app.getHttpServer())
        .put(`${TODOS_URL}/${todoId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          isCompleted: true,
        })
        .expect(200);
    });

    it('should update the title and isCompleted to false', async () => {
      await request(app.getHttpServer())
        .put(`${TODOS_URL}/${todoId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'water the plants',
          isCompleted: false,
        })
        .expect(200);
    });

    it('should be unauthorized to update the todo of testuser', async () => {
      await request(app.getHttpServer())
        .put(`${TODOS_URL}/${todoId}`)
        .send({
          isCompleted: true,
        })
        .expect(401);
    });
  });

  describe('delete a certain todo of testuser DELETE /api/v1/todos/:id', () => {
    it('should delete the todo of testuser', async () => {
      await request(app.getHttpServer())
        .delete(`${TODOS_URL}/${todoId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
