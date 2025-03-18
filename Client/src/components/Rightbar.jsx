import React, { useEffect, useState, useContext } from 'react'
import { Card, Stack, Typography, Avatar, Button } from '@mui/material'
import { getUsers } from '../api'
import { useNavigate } from 'react-router-dom'
import RightbarFriends from './RightbarFriends'
import { AuthContext } from '../context/AuthContext';

const Rightbar = () => {
      const { loggedId, token, searchResult } = useContext(AuthContext);
  const [frnds, setfrnds] = useState([])
  const [allfrnds, setallfrnds] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    async function getFrnds() {
      let response = await getUsers(token);
      setfrnds(response.filter((frnd) => frnd._id != loggedId));
      setallfrnds(response.filter((frnd) => frnd._id != loggedId))
    }
    getFrnds();
  },[token])

  useEffect(() => {
    if (searchResult.length > 0) {
      setfrnds(searchResult);
    }
    else{
      setfrnds(allfrnds)
    }
  },[searchResult])
  


    return (
      <Card
        sx={{
          width: { sm: "80vw", xs: "80vw", md: "80vw", lg: "20vw" },
          p: "2em",
        }}
      >
        <Typography
          fontFamily={"Poppins, sans-serif"}
          fontSize={"1.2em"}
          fontWeight={"700"}
          marginBottom={"1em"}
        >
          Suggested For You
        </Typography>
        {frnds.length > 0 ? (
          <Stack gap={"1.5em"}>
            {frnds.map((frnd) => (
              <RightbarFriends frnd={frnd} />
            ))}
          </Stack>
        ) : (
          "loading"
        )}
      </Card>
    );
}

export default Rightbar