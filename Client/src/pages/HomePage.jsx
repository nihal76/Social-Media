import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api';
import { Stack, Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import Rightbar from '../components/Rightbar';
import Feed from '../components/Feed';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
      const {token,user, setUser}  = useContext(AuthContext)
      console.log('user ', user, token)
  const [posts, setposts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
     async function get() {
      const result = await getUser(user._id,token);
      setUser(result)
     }
     get()
  },[token])

  return (
    <Stack direction={{ sm : 'column', xs : 'column', md : 'column', lg : 'row'}} justifyContent={{ lg : 'space-around'}} alignItems={{xs : 'center', sm : 'center', md : 'center',lg : 'normal'}} gap={"2em"}>
      {user ? (
        <>
          <Sidebar user={user} setUser={setUser}/>
          <Stack flex={{lg : 1}} gap={"2em"}  sx={{width : {xs : '90vw'}}} >
            <CreatePost  posts={posts} setposts={setposts} />
            <Feed posts={posts} setposts={setposts} />
          </Stack>
          <Rightbar />
        </>
      ) : (
        <p>loading...</p>
      )}
    </Stack>
  );
}

export default HomePage