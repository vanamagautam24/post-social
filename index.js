const app = require('./app');
const pool = require('./pool');

const connectionString = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3005;
pool
  .connect(connectionString)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
