export const config = {
  db: {
    type: process.env.DB_TYPE,
    logging: true,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
    synchronize: true,
  },
  jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '12h',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  port: parseInt(process.env.PORT) || 5001,
};
