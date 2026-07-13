const pool = require("../db");

async function createComment(req, res) {
  try {
    const { videoId } = req.params;
    const { content } = req.body;

    const result = await pool.query(
      `
      INSERT INTO comments
      (
        video_id,
        user_id,
        content
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [videoId, req.user.id, content],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create comment",
    });
  }
}

async function getComments(req, res) {
  try {
    const { videoId } = req.params;

    const result = await pool.query(
      `
      SELECT c.*, 
      u.id AS user_id,
      u.name AS user_name,
      u.avatar_url
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE video_id = $1
      ORDER BY created_at DESC
      `,
      [videoId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch comments"
    });
  }
}

module.exports = {
  createComment,
  getComments
};
