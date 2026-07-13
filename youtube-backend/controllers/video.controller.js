const fs = require("fs/promises");
const path = require("path");
const pool = require("../db");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { r2Client } = require("../services/storage.service");

const createVideo = async (req, res) => {
  const { title, description, videoUrl } = req.body;

  try {
    const result = await pool.query(
      `
            INSERT INTO videos
            (
                title,
                description,
                video_url,
                user_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *
            `,
      [title, description, videoUrl, req.user.id],
    );

    await pool.query(`  INSERT INTO jobs(type, payload) VALUES($1, $2) `, [
      "PROCESS_VIDEO",
      JSON.stringify({
        videoId: result.rows[0].id,
        videoUrl: videoUrl,
      }),
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create video",
    });
  }
};

const generateUploadUrl = async (req, res) => {
  try {
    const { fileName } = req.body;

    const objectKey = `${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 300,
    });

    res.json({
      uploadUrl,
      objectKey,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate upload URL",
    });
  }
};

const getVideos = async (req, res) => {
  const { search } = req.query;
  try {
    let query = `
            SELECT
            v.*,
            u.id as user_id,
            u.name as channel_name
            FROM videos v
            LEFT JOIN users u ON v.user_id = u.id
            ${search ? `WHERE v.title ILIKE '%${search}%' OR v.description ILIKE '%${search}%'` : ""}
            ORDER BY v.created_at DESC
        `;
    const result = await pool.query(query);

    const videos = result.rows.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      views: video.views,
      createdAt: video.created_at,
      videoUrl: video.video_url,
      thumbnailUrl: video.thumbnail_url,
      durationSeconds: video.duration_seconds,
      status: video.status,
    }));

    res.json(videos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch videos",
    });
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      WITH updated_video AS (
        UPDATE videos
        SET views = views + 1
        WHERE id = $1
        RETURNING *
      )
      SELECT
        v.id,
        v.title,
        v.description,
        v.video_url,
        v.views,
        v.created_at,
        v.thumbnail_url,
        v.duration_seconds,
        v.status,
        v.likes,
        v.user_id,
        u.name AS channel_name,
        u.email AS channel_email,
        u.avatar_url AS channel_avatar
      FROM updated_video v
      LEFT JOIN users u
        ON v.user_id = u.id
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const video = result.rows[0];

    res.json({
      id: video.id,
      title: video.title,
      description: video.description,
      views: video.views,
      createdAt: video.created_at,
      videoUrl: video.video_url,
      thumbnailUrl: video.thumbnail_url,
      durationSeconds: video.duration_seconds,
      status: video.status,
      likes: video.likes,

      channel: {
        id: video.user_id,
        name: video.channel_name,
        email: video.channel_email,
        avatarUrl: video.channel_avatar,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch video",
    });
  }
};

const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE videos
      SET likes = likes + 1
      WHERE id = $1
      RETURNING likes
      `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to like video"
    });
  }
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  likeVideo,
  generateUploadUrl,
};
