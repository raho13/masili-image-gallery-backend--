const mongoose = require("mongoose");
const Userschema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    about: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    phone: { type: String, default: "" },
    avatar: { type: Object, default: {url:"",id:""} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", Userschema);
