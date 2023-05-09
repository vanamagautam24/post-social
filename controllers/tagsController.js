const pool = require('../pool');

exports.createTag = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Tag name is required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO tags (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating tag' });
  }
};

exports.getTags = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tags');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching tags' });
  }
};

exports.getTagById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM tags WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching tag' });
  }
};

exports.deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM tags WHERE id = $1', [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting tag' });
  }
};

exports.deleteAllTags = async (req, res) => {
  try {
    await pool.query('DELETE FROM tags');
    res.status(200).json({ message: 'All tags deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting tags' });
  }
};
