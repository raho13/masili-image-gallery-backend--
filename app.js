const express = require("express");
const app = express();
const server = require("http").createServer(app);
const mongoose = require("mongoose");
const postRoute = require("./Routes/Post");
const registerRoute = require("./Routes/Register");
const loginRoute = require("./Routes/Login");
const profileRoute = require("./Routes/Profile");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const auth = require("./Middlewares/Auth");
const io = require("socket.io")(server, { cors: { origin: "*" } });
require("dotenv/config");
const port = process.env.PORT || 4000;
 //require('./Sockets/mainSocket')(io)
//Cloudinary confic
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
//----------------------------------------------------
//Connect to db
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTED to DB.");
  })
  .catch(() => {
    console.log("CONNETION ERROR");
  });
//----------------------------------------------------
//Cors options
const corsOptions = {
  origin: ["http://localhost:3000", "http://masili.herokuapp.com"],
  optionsSuccessStatus: 200,
};
//----------------------------------------------------
//App confic
 app.set("socket", io);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
//----------------------------------------------------
//Routes
app.use("/post", postRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/profile", auth, profileRoute);
app.use("/", auth, (req, res) => {
  res.send("<h1>Mgallery API</h1>");
});

server.listen(port, () => {
  console.log("runing in http://localhost:" + port);
});
