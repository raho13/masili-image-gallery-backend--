const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
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
    const validPassword = await bcrypt.compare(
      req.body.old_password,
      user.password
    );
    if (validPassword) {
      if (req.body.new_password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
        const updatePost = await User.updateOne(
          { _id: req.user._id },
          {
            $set: {
              username: req.body.username,
              email: req.body.email,
              about: req.body.about,
              phone: req.body.phone,
              password: hashedPassword,
            },
          }
        );
        res.json(updatePost);
      } else {
        const updatePost = await User.updateOne(
          { _id: req.user._id },
          {
            $set: {
              username: req.body.username,
              email: req.body.email,
              about: req.body.about,
              phone: req.body.phone,
            },
          }
        );
        res.json(updatePost);
      }
    } else {
      res.status(401).send("invalid password");
    }
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
