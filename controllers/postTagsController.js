const pool = require('../pool');

exports.createPostTag = async (req, res) => {
  const { post_id, tag_id } = req.body;

  // ... (previous code)

  if (!post_id || !tag_id) {
    return res
      .status(400)
      .json({ error: 'Both post_id and tag_id are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) RETURNING *',
      [post_id, tag_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating post tag' });
  }
};

exports.getPostTags = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM post_tags');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching post tags' });
  }
};

exports.getPostTagById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM post_tags WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post tag not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching post tag' });
  }
};

exports.deletePostTag = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM post_tags WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Post tag not found' });
    }

    res.status(200).json({ message: 'Post tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting post tag' });
  }
};

exports.deleteAllPostTags = async (req, res) => {
  try {
    await pool.query('DELETE FROM post_tags');

    res.status(200).json({ message: 'All post tags deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting all post tags' });
  }
};
