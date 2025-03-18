const express = require("express");
const multer = require("multer");
const Users = require("../models/User");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");
const { trusted } = require("mongoose");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// Create a new post
router.post("/createPost/:userId", upload.single('file') ,authMiddleware, async (req, res) => {
 try {
   let user = await Users.findById(req.params.userId)
   console.log('create post ', user)
   let newPost = new Post({
      ...req.body,
      imageUrl : req.file.filename,
      user : user._id
   })
   console.log(newPost)
   await newPost.save()
   newPost = {
     ...newPost.toObject(),
     username: user.username,
     profilePicture: `https://social-media-backend-kq4l.onrender.com/profile/${user.profilePicture}`,
     imageUrl: `https://social-media-backend-kq4l.onrender.com/uploads/${req.file.filename}`,
   };
   res.status(201).json(newPost)
 } catch (error) {
  res.status(500).json({msg : 'Internal server error'})
 }
 
});


// specific user posts for profile page
router.get("/:profileId", authMiddleware ,async (req, res) => {
  try {
    let frnd = await Users.findById(req.params.profileId)
    console.log('frnd ..', frnd)
    let loggedUserId = req.user._id
    console.log(" loggedUserId", loggedUserId);
     if( (!frnd.followers.includes(loggedUserId)) && (req.params.profileId != loggedUserId) ){
       console.log(`follow ${frnd.username} to view their post`)
       return res.json([])
     }
    let posts = await Post.find({ user: req.params.profileId });
       posts = posts.map((post) => {
        return {
          ...post.toObject(),
          username: frnd.username,
          profilePicture: `https://social-media-backend-kq4l.onrender.com/profile/${frnd.profilePicture}`,
          imageUrl: `https://social-media-backend-kq4l.onrender.com/uploads/${post.imageUrl}`,
        };})
       console.log('specific posts..................')
       console.log(posts)
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// get all posts for feed
router.get("/", authMiddleware, async (req, res) => {
  try {
     let user = await Users.findById(req.user._id)
     let followings = user.following 
    //  add current user in followings to view our post
    followings = [...followings, user._id]
     console.log('current user ', user)
    let posts = await Post.find({user : {$in : followings }});

    posts = await Promise.all(
      posts.map(async (post) => {
        let user = await Users.findById(post.user);
        console.log(user);
        return {
          ...post.toObject(),
          username: user.username,
          userId: user._id,
          profilePicture: `https://social-media-backend-kq4l.onrender.com/profile/${user.profilePicture}`,
          imageUrl: `https://social-media-backend-kq4l.onrender.com/${post.imageUrl}`,
        };
      })
    );
    console.log("all the posts ", posts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Delete a post
router.delete("/deletepost/:postId", authMiddleware, async (req, res) => {
  try {
    console.log('post id:', req.params.postId);
    
    const post = await Post.findById(req.params.postId);
    
    if (post.user != req.user._id) {
      return res.status(403).json({ error: "Unauthorised cant delete someone else post" });
    }

    console.log('actual post:', post);

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post deleted successfully" });
    
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update post
router.patch('/EditPost/:postId',authMiddleware ,async (req,res) => {
  try{
       const post = await Post.findById(req.params.postId);
       console.log('post to update ', post)
       if (post.user != req.user._id) {
         return res
           .status(403)
           .json({ error: "Unauthorised cant edit someone else post" });
       }
       const {caption} = req.body
       console.log('to update ', caption)
       let updatedPost = await Post.findByIdAndUpdate(req.params.postId,{caption},{new : true})
       console.log('updated posts', updatedPost)
       res.status(200).json(updatedPost.caption)
  }
  catch(err){
     res.status(500).json({ error: "Internal server error" });
  }
})

// Like, dislike a post
router.post("/like", authMiddleware, async (req, res) => {
  const { postId, username } = req.query;
   try {
      let post = await Post.findById(postId);
      let postuser = await Users.findById(post.user)
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    //  if post is already liked by user, unlike it
     if(post.likes.includes(username)){
         post.likes = post.likes.filter((user) => user !== username);
         await post.save()
     }
     else{
        post.likes.unshift(username);
        await post.save()
     }
     post = {
       ...post.toObject(),
       username: postuser.username,
       profilePicture: `https://social-media-backend-kq4l.onrender.com/profile/${postuser.profilePicture}`,
       imageUrl: `https://social-media-backend-kq4l.onrender.com/${post.imageUrl}`,
     };
     console.log('updated ', post)
     res.status(200).json(post)
   } catch (error) {
      res.status(500).json({msg : 'Internal Server Error'})
   }
});


// Add a comment to a post
router.post("/comment", authMiddleware, async (req, res) => {
  const { postId,username} = req.query;
  const { comment } = req.body;
  try{
       const user = await Users.findOne({ username });
       let post = await Post.findById(postId);
              console.log(post);
       const newComment = {
         username,
         profilePicture: `https://social-media-backend-kq4l.onrender.com/profile/${user.profilePicture}`,
         comment,
       };
       post.comments.unshift(newComment)
       await post.save()
      //  send updated  comments
       res.status(201).json(post.comments)
  }
  catch(err){
   res.status(500).json({msg : 'Internal Server error'})
  }
});

// delete comment
router.delete('/deleteComment/:postId/:commentId',authMiddleware, async (req,res) => {
   const {postId,commentId} = req.params
    try {
     const updatedDoc = await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } }, {new : true});
      res.status(200).json({msg : 'comment deleted', updatedComments : updatedDoc.comments})
    }
    catch(err) {
      res.status(500).json({ message: "Server error." });
    }
      
})

module.exports = router;
