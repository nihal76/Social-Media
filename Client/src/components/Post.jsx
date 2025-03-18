import { Card, CardContent, Typography, Box, Stack, Avatar } from '@mui/material'
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from "@mui/icons-material/Send";
import {TextField, Button} from '@mui/material';
import React, { useState,useContext } from 'react'
import { likePost, commentPost } from '../api';
import { AuthContext } from '../context/AuthContext';
import { deletePost, updatePost, deleteComment } from '../api';
import { useNavigate } from 'react-router-dom';

const Post = ({post, posts, setposts}) => {
    const {user,token} = useContext(AuthContext)
    const {username} = user
    const navigate = useNavigate()
//  for commmenting on post
 const [iscomment, setcomment] = useState(false)
 const [commentText, setcommentText] = useState('')
//  state for displaying edit and delete option
 const [isToggled, setToggled] = useState(false)

//  state for editing post
const [isEdit, setEdit] = useState(false)
const [editText, setEditText] = useState('')

   //  like post
 async function like( postId){
    const result = await likePost(username, postId,token);
    console.log(result)
    // update post
    setposts(posts.map((post) => {
       if(post._id === result._id){
        return result
       }
       else{
        return post
       }
    }))
  }
  // handle comment submitting
 async function submitComment(postId) {
   const updatedComments = await commentPost(username, postId, commentText, token);
   // update post
   setposts(
     posts.map((post) => post._id == postId ? {
      ...post,
      comments : updatedComments
     } : post)
   );
    setcommentText('')
 }

//   comment delete
async function commentDelete(postId,commentId) {
  let updatedComments = await deleteComment(postId, commentId, token)
  let updatedDocs = posts.map((post) => post._id == postId ? {
    ...post,
    comments : updatedComments
  } : post)
  setposts(updatedDocs)
}

//  post deletion
 async function postDelete(postId) {
    const response = await deletePost(postId,token)
    if(response.status === 200){
     let prevPosts = posts.filter((post) => post._id !== postId)
     console.log('prevposts ', prevPosts)
     setposts(prevPosts)
    }
 }
//  post updation
async function postUpdate(postId,editText) {
  const updatedPostCaption = await updatePost(postId,editText,token)
    setposts(posts.map((post) => (post._id == postId ? {
      ...post,
      caption : updatedPostCaption
    } : post)));
    setEdit(false)
    setEditText('')

}

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        p: "1.5em",
      }}
    >
      {/* user info */}

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"} gap={"1em"}>
          <Avatar
            src={post.profilePicture ? post.profilePicture : null}
            sx={{ width: 50, height: 50 }}
            onClick={() => navigate(`/profile/${post.userId}`)}
          />
          <Typography fontSize={"1.3em"}>{post.username}</Typography>
        </Stack>
        {/* display box for edit, delete */}

        <Stack direction={"row"}>
          {isToggled ? (
            <Card sx={{ display: "flex", flexDirection: "column", p: "1em" }}>
              <Button
                onClick={(e) => {
                  setEdit(true);
                  setEditText(post.caption);
                }}
              >
                Edit
              </Button>
              <Button color="error" onClick={() => postDelete(post._id)}>
                Delete
              </Button>
            </Card>
          ) : null}
           {
            post.username === user.username ? 
            <IconButton onClick={() => setToggled(!isToggled)}>
            <MoreVertIcon />
          </IconButton> : null
           }
        </Stack>
      </Stack>
      <img src={post.imageUrl} style={{ maxWidth: "100%", height: "auto" }} />
      <Typography
        fontSize={"1.2em"}
        fontFamily={"Poppins, sans-serif"}
        fontWeight={"500"}
      >
        {post.caption}
      </Typography>
      {/* for editing caption */}

      {isEdit ? (
        <Box sx={{ display: "flex", gap: "0.3em" }}>
          <TextField
            sx={{ width: "70%" }}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <Button onClick={() => postUpdate(post._id, editText)}>Update</Button>
          <Button
            color="error"
            onClick={() => {
              setEdit(false);
              setEditText("");
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : null}

      {/* like,comment */}

      <Stack flexDirection={"row"}>
        <IconButton onClick={() => like(post._id)}>
          {post.likes.includes(user.username) ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
          <Typography>
            {" "}
            {post.likes.length > 0 ? post.likes.length : ""}
          </Typography>
        </IconButton>
        <IconButton onClick={() => setcomment(!iscomment)}>
          <ChatBubbleOutlineIcon />
          <Typography> {post.comments.length}</Typography>
        </IconButton>
      </Stack>

      {/* display field to comment if user has toggled comment btn */}
      {iscomment ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              type="text"
              variant="filled"
              value={commentText}
              label="Add comment"
              multiline
              sx={{ width: "80%", border: "none" }}
              onChange={(event) => setcommentText(event.target.value)}
            />
            <IconButton onClick={() => submitComment(post._id)}>
              <SendIcon fontSize="large" />
            </IconButton>
          </Box>
          {/* display list of  comments */}
          {post.comments.length > 0 ? (
            <Stack>
              {post.comments.map((comment) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "0.5em",
                      alignItems: "center",
                      borderBottom: "1.2px solid lightgrey",
                      pb: 1,
                    }}
                  >
                    <Avatar
                      src={comment.profilePicture}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Box>
                      <Typography fontWeight={"600"}>
                        {comment.username}
                      </Typography>
                      <Typography fontWeight={"300"}>
                        {comment.comment}
                      </Typography>
                    </Box>
                    {/* delete comment only for the user who has commented on post */}
                   {
                    comment.username == user.username ? 
                     <IconButton onClick={() => commentDelete(post._id,comment._id)}>
                      <DeleteIcon />
                    </IconButton> : null
                   }
                  </Box>
                </>
              ))}
            </Stack>
          ) : (
            <Typography>No comments</Typography>
          )}
        </>
      ) : null}
    </Card>
  );
}

export default Post
