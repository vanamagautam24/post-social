// server.js
const app = require('./app');
const pool = require('./pool');

pool
  .connect({
    host: 'localhost',
    port: 5432,
    database: 'post-social',
    user: 'vanama',
    password: 'password',
  })
  .then(() => {
    app.listen(3005, () => {
      // Remove the parentheses after 'app'
      console.log('Server is listening on port 3005');
    });
  })
  .catch((err) => {
    console.error(err);
  });
