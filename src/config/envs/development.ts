export const config = {
  db: {
    type: process.env.DB_TYPE || 'postgres',
    logging: true,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'bookstore',
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
    synchronize:
      'SYNCHRONIZE_DB' in process.env
        ? process.env.SYNCHRONIZE_DB === 'false'
          ? false
          : true
        : true,
  },
  jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '2m',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '2d',
  port: parseInt(process.env.PORT) || 5001,
};
