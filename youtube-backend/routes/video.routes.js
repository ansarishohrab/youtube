const express = require('express');

const {
    createVideo,
    getVideos,
    getVideoById,
    generateUploadUrl,
    likeVideo
} = require('../controllers/video.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();
router.get('/', getVideos);
router.post('/', authenticate, createVideo);
router.post('/upload-url', authenticate, generateUploadUrl);
router.get('/:id', getVideoById);
router.post(
  '/:id/like',
  authenticate,
  likeVideo
);

module.exports = router;