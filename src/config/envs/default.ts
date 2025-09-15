export const config = {
  db: {
    entities: [`${__dirname}/../../entities/*.{js,ts}`],
  },
  jwtSecret:
    process.env.JWT_SECRET || 'default-super-secret-jwt-key-for-development',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    'default-super-secret-refresh-key-for-development',
  jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '1h',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
};
