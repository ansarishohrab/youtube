const pool = require("../db");

const getChannel = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.avatar_url,
        COUNT(v.id)::INTEGER AS video_count,
        COALESCE(SUM(v.views), 0)::INTEGER AS total_views
      FROM users u
      LEFT JOIN videos v
        ON u.id = v.user_id
      WHERE u.id = $1
      GROUP BY u.id
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch channel",
    });
  }
};

const getChannelVideos = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        title,
        thumbnail_url,
        views,
        likes,
        duration_seconds,
        created_at
      FROM videos
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch channel videos",
    });
  }
};

module.exports = {
  getChannel,
  getChannelVideos,
};