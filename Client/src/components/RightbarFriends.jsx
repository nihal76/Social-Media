import React, { useState } from 'react'
import { useContext } from 'react';
import { followUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { Stack, Avatar, Typography, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const RightbarFriends = ({frnd}) => {
  const {token,user, setUser}  = useContext(AuthContext)
  const navigate = useNavigate()
    
    console.log(frnd.following)
  // handle following of user
   async function follow(profileId){
     console.log('follow this user', profileId)
      const response = await followUser(profileId,user._id,token)
      console.log('updated current user following', response)
      setUser({
        ...user,
        following : response
      })
   }

  return (
    <Stack
      direction={"row"}
      gap={"1em"}
      alignItems={"center"}
      key={frnd._id}
      sx={{ cursor: "pointer" }}
    >
      <Avatar
        src={frnd.profilePicture}
        sx={{ width: 70, height: 70, cursor: "pointer" }}
        onClick={() => navigate(`/profile/${frnd._id}`)}
      />
      <Stack sx={{ cursor: "pointer" }} gap={"0.2em"}>
        <Typography
          fontSize={"1.1em"}
          fontFamily={"Poppins, sans-serif"}
          fontWeight={"600"}
          onClick={() => navigate(`/profile/${frnd._id}`)}
        >
          {frnd.username}
        </Typography>
        <Typography fontSize={"0.8em"} fontWeight={"300"}>
          {frnd.occupation}
        </Typography>
        <Button
          variant={user.following.includes(frnd._id) ? 'outlined' : 'contained'}
          size="small"
          onClick={() => follow(frnd._id)}
        >
          {user.following.includes(frnd._id) ? "Following" : "Follow"}
        </Button>
      </Stack>
    </Stack>
  );
}

export default RightbarFriends