const pool = require('../pool');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // If password matches, proceed with login (e.g., create a session, generate a token, etc.)
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};

exports.register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    // Check if the username or email already exists in the database
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (checkUser.rowCount > 0) {
      return res
        .status(400)
        .json({ error: 'Username or email already exists' });
    }

    // Insert the new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (firstname, lastname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, username, email, password]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
};
