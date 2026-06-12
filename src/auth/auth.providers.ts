import { DataSource } from 'typeorm';
import { RefreshToken } from './entities/refreshToken.entity';

export const refreshProviders = [
  {
    provide: 'REFRESH_TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RefreshToken),
    inject: ['DATA_SOURCE'],
  },
];
