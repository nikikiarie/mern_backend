const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    description: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { type: String },
    picturePath: { type: String },
    postPicturePath:{type:String},
    likes: { type: Map, of: Boolean },
    comments: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
