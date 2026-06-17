const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, async (req, res) => {
  res.json({
    success: true,
    user: req.user.uid,
    rooms: [],
  });
});

module.exports = router;