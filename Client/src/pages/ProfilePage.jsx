import React, {useState, useEffect, useContext} from 'react'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import CreatePost from '../components/CreatePost'
import Followers from '../components/Followers'
import { useParams } from 'react-router-dom'
import { getUser, getPost } from '../api'
import { Stack, Box, Typography } from '@mui/material'
import LockIcon from "@mui/icons-material/Lock";
import {IconButton} from '@mui/material'
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  // current logged user
     const {user, setUser,token}  = useContext(AuthContext)
    const [profile, setprofile] = useState(null)
    const [specificPosts, setspecificPosts] = useState([])
    const params = useParams();
    console.log(params.userId);

  useEffect(() => {
    async function fetchUser(userId) {
      const response = await getUser(userId,token)
      setprofile(response)
    }
    fetchUser(params.userId)
  },[])
  
  useEffect(() => {
    async function fetchPosts(userId) {
      console.log('user Id to fetch..', userId)
      const response = await getPost(userId,token)
      console.log('response ', response)
      setspecificPosts(response)
    }
    fetchPosts(params.userId);
  },[])

  return (
    <>
      {profile ? (
        <Stack
          direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
          gap={"2em"}
          alignItems={{ xs: "center", lg: "normal" }}
        >
          <Stack gap={"2em"}>
            <Followers user={profile} totalposts={specificPosts.length} />
            <Sidebar user={profile} setuser={setprofile} />
          </Stack>
          <Stack gap={"2em"} sx={{ width: { xs: "90vw", lg: "40vw" } }}>
            {user._id == params.userId ? <CreatePost user={profile} /> : null}
            {(specificPosts.length > 0 &&
              user.following.includes(params.userId)) ||
            (params.userId === user._id && specificPosts.length > 0) ? (
              <Feed posts={specificPosts} setposts={setspecificPosts} />
            ) : params.userId != user._id &&
              !user.following.includes(params.userId) ? (
              <Stack alignItems={"center"}>
                <Typography
                  fontFamily={"Poppins, sans-serif"}
                  fontSize={"1.5em"}
                >
                  Follow this account to view post
                </Typography>
                <IconButton>
                  <LockIcon sx={{ height: "7em", width: "7em" }} />
                </IconButton>
              </Stack>
            ) : (
              <Typography fontWeight={"bold"} fontSize={"1.5em"}>
                No Posts
              </Typography>
            )}
          </Stack>
        </Stack>
      ) : (
        "loading.."
      )}
    </>
  );
}

export default ProfilePage