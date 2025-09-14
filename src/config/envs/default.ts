export const config = {
  db: {
    entities: [`${__dirname}/../../entities/*.{js,ts}`],
    migrations: [`${__dirname}/../../migrations/*.{js,ts}`],
    migrationsRun: true,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
