const pool = require('../pool');

exports.createPostImage = async (req, res) => {
  const { post_id, image_url } = req.body;

  if (!post_id || !image_url) {
    return res
      .status(400)
      .json({ error: 'Both post_id and image_url are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO post_images (post_id, image_url) VALUES ($1, $2) RETURNING *',
      [post_id, image_url]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating post image' });
  }
};

exports.getPostImages = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM post_images');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching post images' });
  }
};

exports.getPostImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT post_images.*, users.id as user_id, users.firstname, users.lastname, users.username, users.email
       FROM post_images
       JOIN posts ON post_images.post_id = posts.id
       JOIN users ON posts.user_id = users.id
       WHERE post_images.id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post image not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching post image' });
  }
};

exports.deletePostImage = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM post_images WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Post image not found' });
    }
    res.status(200).json({ message: 'Post image deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting post image' });
  }
};

exports.deleteAllPostImages = async (req, res) => {
  try {
    await pool.query('DELETE FROM post_images');
    res.status(200).json({ message: 'All post images deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting all post images' });
  }
};
