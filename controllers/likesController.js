const pool = require('../pool');

exports.createLike = async (req, res) => {
  const { post_id, user_id } = req.body;

  if (!post_id || !user_id) {
    return res
      .status(400)
      .json({ error: 'Both post_id and user_id are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *',
      [post_id, user_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating like' });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM likes');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching likes' });
  }
};

exports.getLikeById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM likes WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Like not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching like' });
  }
};

exports.deleteLike = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM likes WHERE id = $1', [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Like not found' });
    }

    res.status(200).json({ message: 'Like deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting like' });
  }
};

exports.removeLike = async (req, res) => {
  const { post_id, user_id } = req.params;

  if (!post_id || !user_id) {
    return res
      .status(400)
      .json({ error: 'Both post_id and user_id are required' });
  }

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
      [post_id, user_id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Like not found' });
    }

    res.status(200).json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while removing like' });
  }
};

exports.deleteAllLikes = async (req, res) => {
  try {
    await pool.query('DELETE FROM likes');
    res.status(200).json({ message: 'All likes deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting all likes' });
  }
};
