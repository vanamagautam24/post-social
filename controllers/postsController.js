const pool = require('../pool');

exports.createPost = async (req, res) => {
  const { content, user_id } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Get the user ID from the request (assumes you have a middleware that sets the user_id)
  // const user_id = req.user_id;

  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (content, user_id, image_url) VALUES ($1, $2) RETURNING *',
      [content, user_id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT posts.*, users.firstname, users.lastname, users.username
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching posts' });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching post' });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const { rowCount } = await pool.query(
      'UPDATE posts SET content = $1 WHERE id = $2',
      [content, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating post' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting post' });
  }
};

exports.deleteAllPosts = async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM posts');

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Posts not found' });
    }

    res.status(200).json({ message: 'Posts deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting posts' });
  }
};
