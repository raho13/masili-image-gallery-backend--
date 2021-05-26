const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRoute = require("./Routes/Post");
const cors = require("cors");
require("dotenv/config");
const port = process.env.PORT || 4000;
//Connect to db
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("**CONNECTED**");
  })
  .catch(() => {
    console.log("CONNETION ERROR");
  });
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cors());
app.use("/posts", postRoute);
app.use("/", (req, res) => {
  res.send("salam");
});

app.listen(port);
