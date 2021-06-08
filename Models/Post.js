const mongoose = require("mongoose");
const Postschema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    image_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", Postschema);
