const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

const baseURL = "http://localhost:5000/";
// specific user
router.get('/:userId', authMiddleware, async (req,res) => {
  try {
    let user = await User.findById(req.params.userId);
    user = {
      ...user.toObject(),
      profilePicture: baseURL + `profile/${user.profilePicture}`,
    };
    console.log('user ', user)
    res.status(200).send(user)
  } catch (error) {
    res.status(500).json({msg : 'Internal server error'})
  }
})

// Get all users
router.get("/", authMiddleware, async (req, res) => {
  try {
    let users = await User.find().select('username profilePicture occupation');
    users = users.map((user) => (
      {
        ...user.toObject(),
          profilePicture: baseURL + `profile/${user.profilePicture}`
      }
    ))
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// handle follow, unfollow
router.post("/follow/:profileId/:currentUserId", async (req, res) => {
  const { profileId, currentUserId } = req.params;
  let frnd = await User.findById(profileId);
  let currentUser = await User.findById(currentUserId)
  // if already following, unfollow
  if (frnd.followers.includes(currentUserId)) {
    frnd.followers = frnd.followers.filter((userId) => userId != currentUserId );
    currentUser.following = currentUser.following.filter((userId) => userId != profileId);
  } else {
    frnd.followers.unshift(currentUserId);
    currentUser.following.unshift(profileId);
  }

  await frnd.save();
  await currentUser.save();
  // send only current user following array
  res.status(200).json(currentUser.following)
});

// route to add links
router.patch('/addLinks',authMiddleware, async (req,res) => {
   try{
     console.log(req.body);
     const response = await User.findByIdAndUpdate(req.user._id, req.body);
     res.status(204)
   }
   catch(err){
     res.status(500).json({ message: "Server error." });
   }
})

// search user profiles
router.get("/searchUsers/:searchTerm", async (req, res) => {
  try {
     console.log("request received");
     const searchTerm = req.params.searchTerm;
     console.log("Searching...", searchTerm);
     const result = await User.find({ username: { $regex: searchTerm, $options: "i" } });
     console.log('result ', result)
     res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
