const pool = require('../pool');

exports.createNotification = async (req, res) => {
  const { user_id, content, type } = req.body;

  if (!user_id || !content || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO notifications (user_id, content, type) VALUES ($1, $2, $3) RETURNING *',
      [user_id, content, type]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating notification' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notifications');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ error: 'An error occurred while fetching notifications' });
  }
};

exports.getNotificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM notifications WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching notification' });
  }
};

exports.updateNotification = async (req, res) => {
  const { id } = req.params;
  const { content, type } = req.body;

  try {
    const { rowCount } = await pool.query(
      'UPDATE notifications SET content = $1, type = $2 WHERE id = $3',
      [content, type, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification updated successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating notification' });
  }
};

exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM notifications WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting notification' });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM notifications');

    if (rowCount === 0) {
      return res.status(404).json({ error: 'No notifications found' });
    }

    res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting notifications' });
  }
};

exports.getUserNotifications = async (req, res) => {
  // Assuming you have a middleware that sets the user_id
  const user_id = req.params.id;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM notifications WHERE recipient_id = $1',
      [user_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user notifications' });
  }
};
