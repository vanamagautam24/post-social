const pool = require('../pool');

exports.createComment = async (req, res) => {
  const { post_id, user_id, content } = req.body;

  if (!post_id || !user_id || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [post_id, user_id, content]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM comments');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching comments' });
  }
};

exports.getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM comments WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching comment' });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const { rowCount } = await pool.query(
      'UPDATE comments SET content = $1 WHERE id = $2',
      [content, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating comment' });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM comments WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting comment' });
  }
};

exports.deleteAllComments = async (req, res) => {
  try {
    await pool.query('DELETE FROM comments');
    res.status(200).json({ message: 'All comments deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting all comments' });
  }
};
