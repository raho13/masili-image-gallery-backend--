const express = require("express");
const Post = require("../Models/Post");
const router = express.Router();
require("dotenv/config");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const Posts = require("../Models/Post");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
router.get("/", (req, res) => {
  try {
    Post.find({}, (err, data) => {
      if (err) throw new Error("Something went wrong");
      res.json({ posts: data });
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ml_default",
      folder: "masiliImages/images/",
      public_id: new Date().toISOString(),
    });
    const post = new Post({
      image: uploadResponse.url,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
    });
    post.save().then((data) => res.json(data));

    // res.json({ msg: "yaya" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = router;
