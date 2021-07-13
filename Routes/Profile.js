const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
//Get profile data
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new Error("user not found");
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
//Update personal data
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) throw "user not found";
    const validPassword = await bcrypt.compare(
      req.body.old_password,
      user.password
    );
    //if (!validPassword) throw "invalid password";
    if (true) {
      //With password update
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
        if (!updatePost) throw "data not updated";
        var io = req.app.get("socket");
        io.on("connection", (socket) => {
          console.log(socket.id, "hi");
          socket.on("data", (msg) => {
            console.log("message: " + msg);
            io.to(socket.id).emit("data", msg);
          });
        });
        res.json(updatePost);
      }
      //Without password update
      else {
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
        if (!updatePost) throw new Error("data not updated");

        res.json(updatePost);
      }
    } else {
      res.status(401).send("invalid password");
    }
  } catch (err) {
    res.json(err);
  }
});
//Update avatar
router.post("/image", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) throw new Error("user not found");
    const validPassword = await bcrypt.compare(
      req.body.old_password,
      user.password
    );
    if (!validPassword) throw new Error("invalid password");
    if (validPassword) {
      //delete current avatar
      if (!(req.body.old_img_id === "")) {
        const deleteimage = await cloudinary.uploader.destroy(
          req.body.old_img_id,
          (result) => {
            res.send(result);
          }
        );
        if (!deleteimage) throw new Error("photo not updated");
      }
      const fileStr = req.body.avatar;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "ml_default",
        folder: "masiliImages/avatars/",
        public_id: new Date().toISOString(),
      });
      if (!uploadResponse) throw new Error("photo not updated");
      if (req.body.new_password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
        const updatePost = await User.updateOne(
          { _id: req.user._id },
          {
            $set: {
              avatar: { url: uploadResponse.url, id: uploadResponse.public_id },
              username: req.body.username,
              email: req.body.email,
              about: req.body.about,
              phone: req.body.phone,
              password: hashedPassword,
            },
          }
        );
        if (!updatePost) throw new Error("photo not updated");
        res.json(updatePost);
      } else {
        const updatePost = await User.updateOne(
          { _id: req.user._id },
          {
            $set: {
              avatar: { url: uploadResponse.url, id: uploadResponse.public_id },
              username: req.body.username,
              email: req.body.email,
              about: req.body.about,
              phone: req.body.phone,
            },
          }
        );
        if (!updatePost) throw new Error("photo not updated");
        res.json(updatePost);
      }
    }
  } catch (err) {
    res.status(401).send({ message: err });
  }
});
//Delete avatar
router.post("/image/delete", async (req, res) => {
  try {
    const deleteimage = await cloudinary.uploader.destroy(
      req.body.public_id,
      (result) => {
        res.send(result);
      }
    );
    const updatePost = await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          avatar: { url: "", id: "" },
        },
      }
    );
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
