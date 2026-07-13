const express = require("express");
const router = express.Router();

const {
  getChannel,
  getChannelVideos,
} = require("../controllers/channel.controller");

router.get("/:id", getChannel);
router.get("/:id/videos", getChannelVideos);

module.exports = router;