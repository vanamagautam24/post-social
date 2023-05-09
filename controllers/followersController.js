const pool = require('../pool');

exports.createFollower = async (req, res) => {
  const { user_id, follower_id } = req.body;

  if (!user_id || !follower_id) {
    return res
      .status(400)
      .json({ error: 'Both user_id and follower_id are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO followers (user_id, follower_id) VALUES ($1, $2) RETURNING *',
      [user_id, follower_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating follower' });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM followers');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching followers' });
  }
};

exports.getFollowerById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM followers WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Follower not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching follower' });
  }
};

exports.deleteFollower = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM followers WHERE id = $1',
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Follower not found' });
    }

    res.status(200).json({ message: 'Follower deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting follower' });
  }
};

exports.followUser = async (req, res) => {
  const { follower_id, followee_id } = req.params;

  if (!follower_id || !followee_id) {
    return res
      .status(400)
      .json({ error: 'Both follower_id and followee_id are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO followers (follower_id, followee_id) VALUES ($1, $2) RETURNING *',
      [follower_id, followee_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while following user' });
  }
};

exports.unfollowUser = async (req, res) => {
  const { follower_id, followee_id } = req.params;

  if (!follower_id || !followee_id) {
    return res
      .status(400)
      .json({ error: 'Both follower_id and followee_id are required' });
  }

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM followers WHERE follower_id = $1 AND followee_id = $2',
      [follower_id, followee_id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Follower not found' });
    }

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while unfollowing user' });
  }
};

exports.deleteAllFollowers = async (req, res) => {
  try {
    await pool.query('DELETE FROM followers');
    res.status(200).json({ message: 'All followers deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting all followers' });
  }
};
