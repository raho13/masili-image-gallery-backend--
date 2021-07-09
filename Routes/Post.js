const express = require("express");
const Post = require("../Models/Post");
const auth = require("../Middlewares/Auth");
const router = express.Router();
require("dotenv/config");
const cloudinary = require("cloudinary").v2;
const Posts = require("../Models/Post");

// GET ALL POST
router.get("/all", async (req, res) => {
  try {
    await Post.find({}, (err, data) => {
      if (err) throw new Error("Something went wrong");
      res.json({ posts: data });
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});
// ADD POST
router.post("/add", auth, async (req, res) => {
  try {
    // add to cloudinary
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ml_default",
      folder: "masiliImages/images/",
      public_id: new Date().toISOString(),
    });
    //add to db
    const post = await new Post({
      image: uploadResponse.url,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      image_id: uploadResponse.public_id,
    });
    post.save().then((data) => res.json(data));

    // res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});
// UPDATE POST
router.post("/update/:postID", auth, async (req, res) => {
  try {
    const updatePost = await Post.updateOne(
      { _id: req.params.postID },
      { $set: { title: req.body.title, description: req.body.description } }
    );
    res.json(updatePost);
  } catch (err) {
    res.json({ message: err });
  }
});
// DELETE POST
router.post("/delete/:postID", auth, async (req, res) => {
  try {
    const deleteimage = await cloudinary.uploader.destroy(
      req.body.image_id,
      (result) => {
        return;
      }
    );
    //  res.json(deleteimage);
    const removepost = await Post.deleteOne({ _id: req.params.postID });
    res.json(removepost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
