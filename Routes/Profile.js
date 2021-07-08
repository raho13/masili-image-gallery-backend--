const express = require("express");
const User = require("../Models/User");
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;
