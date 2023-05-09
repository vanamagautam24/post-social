const pool = require('../pool');

exports.createMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, content]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM messages');

    // ... (previous code)

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching messages' });
  }
};

exports.getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM messages WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching message' });
  }
};

exports.updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const { rowCount } = await pool.query(
      'UPDATE messages SET content = $1 WHERE id = $2',
      [content, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating message' });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM messages WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting message' });
  }
};

exports.deleteAllMessages = async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM messages');

    if (rowCount === 0) {
      return res.status(404).json({ error: 'No messages found' });
    }

    res.status(200).json({ message: 'Messages deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting messages' });
  }
};
