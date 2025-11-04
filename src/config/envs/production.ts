export const config = {
  db: {
    type: process.env.DB_TYPE || 'postgres',
    logging: true,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'bookstore',
    extra: {
      connectionLimit: 10,
      timezone: 'Asia/Ho_Chi_Minh',
    },
    autoLoadEntities: true,
    synchronize: true,
  },
  jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '12h',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  port: parseInt(process.env.PORT) || 5001,
};
