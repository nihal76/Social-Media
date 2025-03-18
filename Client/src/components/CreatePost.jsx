import {
  Stack,
  Card,
  IconButton,
  TextField,
  Button,
  Avatar,
  Box,
  Typography
} from "@mui/material";
import React from 'react'
import { useState } from 'react';
import ImageIcon from "@mui/icons-material/Image";
import VideoIcon from "@mui/icons-material/VideoLibrary";
import LocationIcon from "@mui/icons-material/LocationOn";
import {createPost} from '../api'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
   import EmojiPicker from "emoji-picker-react";
   import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const CreatePost = ({posts, setposts}) => {
  const{user, setUser, token}  = useContext(AuthContext)
  // state for displaying selected image
  const [imgpath, setimgpath] = useState(null)
  // state for storing actual image 
  const [file, setfile] = useState(null)
  const [caption, setcaption] = useState('')
   const [chosenEmoji, setChosenEmoji] = useState(null)
   const [showPicker, setPicker] = useState(false)

   const handleFile = (event) => {
    console.log('fired ...')
     const file = event.target.files[0]
     if(file){
      // create url for selected image
      const path = URL.createObjectURL(file)
      setimgpath(path)
      setfile(file)
     }
   }
   const handleSubmit = async() => {
    const form = new FormData()
    form.append('caption', caption)
    form.append('file', file)
    const newPost = await createPost(form, user._id, token)
    console.log('new post created..', newPost)
    setposts([...posts,newPost])
    // reset states after post creation
    setimgpath(null)
    setfile(null)
    setcaption('')
   }

   const handleEmojiClick = (emojiObject) => {
     setcaption((prevCaption) => prevCaption + emojiObject.emoji);
   };

    return (
      <Card sx={{ p: "1em", height: "fit-content" }}>
        <Stack gap={"2em"}>
          {/* create post */}
          <Stack
            direction={"row"}
            justifyContent={"center"}
            gap={"1em"}
            // position="relative"
          >
            <Avatar
              src={user.profilePicture ? user.profilePicture : null}
              sx={{
                width: { xs: 45, sm: 56 },
                height: { xs: 45, sm: 56 },
              }}
            />
            <TextField
              type="text"
              label="Caption"
              value={caption}
              sx={{ width: "60%", height: { xs: "50%" } }}
              onChange={(e) => setcaption(e.target.value)}
            />
            <IconButton onClick={(e) => setPicker(!showPicker)}>
              <EmojiEmotionsIcon color="primary" fontSize="large" />
            </IconButton>

            {showPicker && (
              <Box
                style={{
                  position: "absolute",
                  top: "10em",
                  zIndex: "1",
      
                }}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick}  />
              </Box>
            )}
          </Stack>

          {/* post icons */}

          <Stack
            direction={"row"}
            gap={{ xs: "1em", sm: "1em", md: "2em" }}
            justifyContent={"center"}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{ cursor: "pointer" }}
            >
              <label htmlFor="post">
                <IconButton component="span">
                  <ImageIcon color="primary" sx={{ fontSize: "1.2em" }} />
                </IconButton>
              </label>
              <Typography>Image</Typography>
            </Stack>
            {/* hidden input for handling image selection */}
            <input
              type="file"
              accept="image/*"
              id="post"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{ cursor: "pointer" }}
            >
              <IconButton>
                <VideoIcon color="warning" />
              </IconButton>
              <Typography>Video</Typography>
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{ cursor: "pointer" }}
            >
              <IconButton>
                <LocationIcon color="success" />
              </IconButton>
              <Typography>Location</Typography>
            </Stack>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              size="small"
            >
              Post
            </Button>
          </Stack>
          {/* selected image preview */}
          {imgpath && (
            <img src={imgpath} style={{ width: "50%", margin: "auto" }} />
          )}
        </Stack>
      </Card>
    );
}

export default CreatePost

