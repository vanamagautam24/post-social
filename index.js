const app = require('./app');
const pool = require('./pool');

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'post-social',
  DB_USER = 'vanama',
  DB_PASSWORD = 'password',
  PORT = 3005,
} = process.env;

pool
  .connect({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
