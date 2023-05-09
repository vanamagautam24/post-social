// controllers/usersController.js
const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');

exports.createUser = async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, password, firstname, lastname]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');

    const parsedRows = toCamelCase(rows);

    res.status(200).json({
      users: parsedRows,
      length: parsedRows.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while getting users' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const parsedRows = toCamelCase(rows);

    res.status(200).json(parsedRows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while getting the user' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const { rowCount } = await pool.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4',
      [username, email, password, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting user' });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting users' });
  }
};

exports.getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const userPromise = pool.query(
      'SELECT id, firstname, lastname, email, username FROM users WHERE username = $1',
      [username]
    );

    const userIdResult = await userPromise;
    if (userIdResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userIdResult.rows[0].id;

    const postsPromise = pool.query(
      'SELECT posts.*, post_images.image_url FROM posts LEFT JOIN post_images ON posts.id = post_images.post_id WHERE posts.user_id = $1',
      [userId]
    );
    const followingPromise = pool.query(
      'SELECT users.id, users.firstname, users.lastname, users.username, users.email FROM users JOIN followers ON users.id = followers.follower_id WHERE followers.user_id = $1',
      [userId]
    );

    const [, postsResult, followingResult] = await Promise.all([
      userPromise,
      postsPromise,
      followingPromise,
    ]);

    const userProfile = {
      ...userIdResult.rows[0],
      posts: postsResult.rows,
      following: followingResult.rows,
      success: true,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user profile' });
  }
};

exports.getFollowedPosts = async (req, res) => {
  const { username } = req.params;

  try {
    // Get the user's ID based on the username
    const { rows: userRows } = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].id;

    // Fetch posts from users that the given user follows
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.firstname, users.lastname, users.username
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      WHERE posts.user_id IN (
        SELECT follower_id FROM followers WHERE user_id = $1
      )
    `,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching followed posts' });
  }
};

exports.getUserNotifications = async (req, res) => {
  const { username } = req.params;

  try {
    // Get the user's ID based on the username
    const { rows: userRows } = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].id;

    // Fetch notifications for the user
    const { rows } = await pool.query(
      `
      SELECT notifications.*, users.firstname, users.lastname, users.username as actor_username
      FROM notifications
      INNER JOIN users ON notifications.actor_id = users.id
      WHERE recipient_id = $1
      ORDER BY created_at DESC
    `,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user notifications' });
  }
};

exports.getUserMessages = async (req, res) => {
  const { username } = req.params;

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    const { rows } = await pool.query(
      `SELECT messages.*, users.firstname AS sender_firstname, users.lastname AS sender_lastname, users.username AS sender_username, 
      r_users.firstname AS receiver_firstname, r_users.lastname AS receiver_lastname, r_users.username AS receiver_username
      FROM messages
      INNER JOIN users ON messages.sender_id = users.id
      INNER JOIN users AS r_users ON messages.receiver_id = r_users.id
      WHERE messages.sender_id = $1 OR messages.receiver_id = $1
      ORDER BY messages.created_at DESC`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user messages' });
  }
};
