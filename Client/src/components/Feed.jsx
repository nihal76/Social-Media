import React, {useEffect, useContext} from "react";
import { getPosts } from "../api";
import Post from './Post'
import { Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const Feed = ({posts, setposts}) => {
   const{token}  = useContext(AuthContext)
  const location = useLocation()

   useEffect(() => {
      const get = async () => {
       const response = await getPosts(token)
       setposts(response)
      }
      if(location.pathname === '/'){
         get();
      }
   },[token])
   console.log('posts ', posts)

  return (
    <Stack gap={"1em"}>
      {posts.length > 0
        ? posts.map((post) => (
           <Post  post={post} posts={posts}  setposts={setposts}/>
          ))
        : <Typography color="secondary" fontWeight={'bold'} fontSize={'large'}>Follow Users to view posts</Typography>}
    </Stack>
  );

}

export default Feed