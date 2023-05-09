const pg = require('pg');

class Pool {
  _pool = null;

  connect(connectionString) {
    this._pool = new pg.Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    return this._pool.query('SELECT 1 + 1;');
  }

  close() {
    return this._pool.end();
  }

  query(sql, params) {
    return this._pool.query(sql, params);
  }
}

module.exports = new Pool();
