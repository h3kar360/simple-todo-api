import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();
  });

  describe('Creating New Users POST /api/v1/auth/signup', () => {
    const SIGNUP_USER_URL = '/api/v1/auth/signup';

    it('should sign up a new user', async () => {
      await request(app.getHttpServer())
        .post(SIGNUP_USER_URL)
        .send({
          username: 'testtestuser5',
          password: 'testuser456',
        })
        .expect(201);
    });

    it('should return a 400 for a username with less than 3 characters', async () => {
      await request(app.getHttpServer())
        .post(SIGNUP_USER_URL)
        .send({
          username: 'ji',
          password: 'iejkksde',
        })
        .expect(400);
    });

    it('should return a 400 for a  password less than 8 characters', async () => {
      await request(app.getHttpServer())
        .post(SIGNUP_USER_URL)
        .send({
          username: 'testuser',
          password: 'ered',
        })
        .expect(400);
    });

    it('should return a 409 for a duplicate username', async () => {
      await request(app.getHttpServer())
        .post(SIGNUP_USER_URL)
        .send({
          username: 'testuser',
          password: 'erwjofww',
        })
        .expect(409);
    });
  });

  describe('Loging In to a Current User POST /api/v1/auth/login', () => {
    const LOGIN_USER_URL = '/api/v1/auth/login';

    it('should login to the user that has been created', async () => {
      await request(app.getHttpServer())
        .post(LOGIN_USER_URL)
        .send({
          username: 'testuser',
          password: 'testuser123',
        })
        .expect(200);
    });

    it('should return 401 for wrong password', async () => {
      await request(app.getHttpServer())
        .post(LOGIN_USER_URL)
        .send({
          username: 'testuser',
          password: 'testuser124',
        })
        .expect(401);
    });
  });

  describe('Create A New Access Token Based On Existing Refresh Token', () => {
    const REFRESH_URL = '/api/v1/auth/refresh';

    it('should create a new access token', async () => {
      // first login to get cookie
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'testuser',
          password: 'testuser123',
        });

      const refreshTokenCookie = loginResponse.headers['set-cookie'];

      // send cookie with refresh request
      await request(app.getHttpServer())
        .post(REFRESH_URL)
        .set('Cookie', refreshTokenCookie)
        .expect(200);
    });
  });

  describe('Logout of The Logged In User', () => {
    const LOGOUT_USER_URL = '/api/v1/auth/logout';

    it('should delete the refresh token of the user', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'testuser',
          password: 'testuser123',
        })
        .expect(200);

      const accessToken = loginResponse.body.accessToken;
      const refreshTokenCookie = loginResponse.headers['set-cookie'];

      await request(app.getHttpServer())
        .post(LOGOUT_USER_URL)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', refreshTokenCookie)
        .expect(200);
    });

    it('should be unauthorized to logout', async () => {
      await request(app.getHttpServer()).post(LOGOUT_USER_URL).expect(401);
    });
  });
});
