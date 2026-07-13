const router = require("express").Router();

const {
  createComment,
  getComments
} = require("../controllers/comment.controller");
const authenticate = require("../middleware/auth.middleware");

router.get('/:videoId/comments', getComments);

router.post('/:videoId/comments', authenticate, createComment);

module.exports = router;