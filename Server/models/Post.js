const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  imageUrl: { type: String },
  user: { type: String, required: true }, 
  likes: { type: [String], default: [] }, 
  comments: [
    {
      username: { type: String }, 
      profilePicture : { type: String },
      comment: { type: String },
    },
  ],
});

module.exports = mongoose.model("Post", PostSchema);
