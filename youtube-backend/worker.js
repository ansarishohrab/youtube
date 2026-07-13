require('dotenv').config();
const pool = require('./db');
const path = require("path");
const fs = require("fs");
const { uploadFile } = require('./services/storage.service');

const {
  downloadVideo,
  generateThumbnail,
  getDuration
} = require("./services/video-processing.service");

async function processJobs() {
  while (true) {
    const result = await pool.query(`
      SELECT *
      FROM jobs
      WHERE status = 'pending'
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT 1;
    `);

    if (result.rows.length === 0) {
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }

    const job = result.rows[0];

    await pool.query(
      `
      UPDATE jobs
      SET status='processing',
          started_at=NOW()
      WHERE id=$1
      `,
      [job.id]
    );

    try {
      console.log("Processing job", job.id);

      const { videoId, videoUrl } = job.payload;
      const tempDir = ensureTempDirectory();

      const videoPath = path.join(tempDir, `${videoId}.mp4`);

      const thumbnailPath = path.join(tempDir, `${videoId}.jpg`);

      await downloadVideo(videoUrl, videoPath);

      await generateThumbnail(videoPath, thumbnailPath);

      const duration = await getDuration(videoPath);

      console.log("Duration:", duration);

      console.log("Thumbnail:", thumbnailPath);
      const thumbnailKey = `thumbnails/${videoId}.jpg`;

      await uploadFile(thumbnailPath, thumbnailKey, "image/jpeg");
      const thumbnailUrl = `${process.env.R2_PUBLIC_URL}/${thumbnailKey}`;
      console.log("Thumbnail URL:", thumbnailUrl);

      fs.unlinkSync(videoPath);
      fs.unlinkSync(thumbnailPath);

      await pool.query(
        `
          UPDATE videos
          SET
              thumbnail_url = $1,
              duration_seconds = $2,
              status = 'ready'
          WHERE id = $3
        `,
        [thumbnailUrl, duration, videoId],
      );

      await pool.query(
        `
        UPDATE jobs
        SET status='completed',
            completed_at=NOW()
        WHERE id=$1
        `,
        [job.id],
      );
    } catch (error) {
      await pool.query(
        `
        UPDATE jobs
        SET status='failed',
            error=$2
        WHERE id=$1
        `,
        [job.id, error.message],
      );
    }
  }
}

function ensureTempDirectory() {
  const tempDir = path.join(
    process.cwd(),
    "temp"
  );

  console.log("process.cwd()", process.cwd());
  console.log("tempDir", tempDir);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, {
      recursive: true,
    });
  }

  return tempDir;
}

processJobs();