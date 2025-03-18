import React from 'react'
import { Card, Stack, Typography, Avatar, Box } from '@mui/material'

const Followers = ({user, totalposts}) => {
  console.log('...', user)
  return (
    <Card sx={{ p: "2em" }}>
      <Stack direction={"row"} gap={"1em"}>
        <Avatar
          src={user.profilePicture}
          sx={{ width: 60, height: 60, cursor: "pointer" }}
        />
        <Stack gap={"0.5em"}>
          <Typography
            fontFamily={"Poppins, sans-serif"}
            fontSize={"1.2em"}
            fontWeight={"500"}
          >
            {user.username}
          </Typography>
          {/* display total posts, followers and following */}
          <Stack direction={"row"} gap={"1em"}>
            <Box>
              <Typography
                sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}
              >
                Posts
              </Typography>
              <Typography sx={{ fontSize: "1.2em" }}>{totalposts}</Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}
              >
                Followers
              </Typography>
              <Typography sx={{ fontSize: "1.2em" }}>
                {user.followers.length}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}
              >
                Following
              </Typography>
              <Typography sx={{ fontSize: "1.2em" }}>
                {user.following.length}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

export default Followers