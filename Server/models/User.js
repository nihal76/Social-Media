const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first: {
    type: String,
    required: true,
  },
  last: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    required: true,
  },
  occupation: {
    type: String
  },
  // social profiles
  LinkedIn : {
    type : String
  },
  Instagram : {
    type : String
  }
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
