const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require('../models/Post')
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const router = express.Router();

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "profile/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

// Register route
  router.post("/register", upload.single("file"), async (req, res) => {
     console.log(req.body)
     console.log(req.file)
     let user = JSON.parse(req.body.user)
     console.log('user ', user)
    try {
          user = {
          ...user,
          password : await bcrypt.hash(user.password,10),
          profilePicture : req.file ? req.file.filename : ''
         }
         const newUser = new User(user)
         console.log('newUser', newUser)
         await newUser.save()
         res.status(201).json({msg : 'user registered'})
    } catch (error) {
      res.status(500).json({msg : 'Internal server error'})
    }
    
  });

  // update user profile
router.put(
  "/updateProfile",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      // parse json data
      let tobeUpdated = JSON.parse(req.body.user)
            const user = await User.findById(req.user._id);
            console.log("user ", user);
       if(! user){
        return res.status(400).json({msg : 'User not found'})
       }

       if(! req.file){
        tobeUpdated.profilePicture = user.profilePicture
       }
       else{
        console.log('executed..')
        tobeUpdated.profilePicture = req.file.filename
       }
       if (!tobeUpdated.password) {
         tobeUpdated.password = user.password;
       } else {
         tobeUpdated.password = await bcrypt.hash(tobeUpdated.password, 10);
       }

       console.log('to be updated ', tobeUpdated)
       let updatedProfile = await User.findByIdAndUpdate(
         req.user._id,
          tobeUpdated,
         { new: true }
       );
       updatedProfile = {
         ...updatedProfile.toObject(),
         profilePicture: `https://social-media-backend-kq4l.onrender.com/profile/${updatedProfile.profilePicture}`,
       };
       await Post.updateMany({'comments.username' : user.username}, 
        {$set : {
          "comments.$[userComment].username" : updatedProfile.username,
          "comments.$[userComment].profilePicture" : updatedProfile.profilePicture
        }},
        {arrayFilters : [{"userComment.username" : user.username}]}
       )
       await Post.updateMany(
         { likes: user.username },
         { $set: { "likes.$": updatedProfile.username } }
       );
       console.log('updatedProfile ', updatedProfile)
       res.status(200).json(updatedProfile)
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);


// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    // construct url for displaying post
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password.try again" });
    }
     user = {
       ...user.toObject(),
       profilePicture: `https://social-media-backend-kq4l.onrender.com/profile/${user.profilePicture}`,
     };
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ user,token });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/deleteAccount",authMiddleware, async(req, res) => {
 try {
  const user = await User.findById(req.user._id)
    console.log("to be deleted", user);
   const posts = await Post.find(req.user._id);
    if(posts){
       await Post.deleteMany(req.user._id);
    }
    //  delete user activities likes, comments
    await Post.updateMany({likes : user.username}, {$pull : {likes : user.username}})
    await Post.updateMany(
      { "comments.username": user.username },
      { $pull: { comments: { username: user.username } } }
    );
    //  delete all the other users follower whose userename is current user
    await User.updateMany(
      { followers: req.user._id },
      { $pull: { followers: req.user._id } }
    );

   
   await User.findByIdAndDelete(req.user._id);
   res.status(200).json({msg : 'Your account has been deleted'})
 } catch (error) {
    res.status(500).json({ message: "Server error." });
 }
});

module.exports = router;
