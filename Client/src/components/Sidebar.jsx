import React, { useState } from 'react'
import {Card, Stack, Typography, Avatar, IconButton , Button, TextField, Box} from '@mui/material'
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CreateIcon from "@mui/icons-material/Create";
import WarningIcon from "@mui/icons-material/Warning";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { updateLinks, accountDelete } from '../api';
import Link from "@mui/material/Link";

const Sidebar = ({user,setUser}) => {
  // context api state for editing profile
   const { loggedId, isEdit, setisEdit, token, Logout } =
     useContext(AuthContext);

  const params = useParams();
  const location = useLocation()
  const navigate = useNavigate()

  // states for link
    const [islink, setislink] = useState(false);
  const [link, setLinks] = useState('')

  // state for account delete confirmation
  const [isDelete, setdelete] = useState(false)

  console.log('sidebar ', user)

 function navigateProfile() {
   setisEdit(true);
   navigate('/register')
 }
 // delete account
 async function deleteAccount() {
   const response = await accountDelete(token)
      navigate("/register");
 }


  return (
    <Card
      sx={{
        p: "1em",
        width: { sm: "80vw", xs: "80vw", md: "80vw", lg: "25vw" },
        height: {
          xs: "fit-content",
          sm: "fit-content",
          md: "fit-content",
          lg: "fit-content",
        },
      }}
    >
      <Stack gap={"1.5em"} sx={{ height: "90%" }}>
        {/* username, profile */}
        <Stack
          className="userinfo"
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} gap={"1em"}>
            <Avatar
              src={user.profilePicture ? user.profilePicture : null}
              sx={{ width: 56, height: 56 }}
            />
            <Typography variant="h5">{user.username}</Typography>
          </Stack>
          <IconButton>
            <PersonIcon
              fontSize="large"
              color="primary"
              onClick={() => navigate(`/profile/${user._id}`)}
            />
          </IconButton>
        </Stack>
        {/* location, occupation */}
        <Stack className="userloc">
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton>
              <LocationOnIcon color="success" />
            </IconButton>
            <Typography>{user.location}</Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton>
              <WorkIcon color="secondary" />
            </IconButton>
            <Typography>{user.occupation}</Typography>
          </Stack>
        </Stack>
        {/* social profiles */}
        <Stack>
          <Typography>Social Profiles</Typography>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton>
                <LinkedInIcon color="primary" />
              </IconButton>
              <Link
                href={user.LinkedIn ? user.LinkedIn : null}
                color="textSecondary"
                fontSize={"1.2em"}
              >
                LinkedIn
              </Link>
            </Stack>
            {params.userId == loggedId ?  <IconButton onClick={() => setislink(!islink)}>
              <CreateIcon />
            </IconButton> : null}
          </Stack>

          {/* field for adding links */}
          {islink ? (
            <Stack direction={"row"} alignItems={"center"} gap={"0.5em"}>
              <TextField
                variant="outlined"
                value={link}
                onChange={(e) => setLinks(e.target.value)}
              />
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => updateLinks(token, link)}
              >
                Add
              </Button>
            </Stack>
          ) : null}
        </Stack>
        {/* buttons for updating profile, deleting account only for logged user */}

        {params.userId == loggedId || location.pathname == "/" ? (
          <>
            <Button variant="contained" onClick={navigateProfile}>
              Update Profile
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setdelete(!isDelete)}
            >
              Delete Account
            </Button>
            {/* confirmation for deleting account */}
            {isDelete ? (
              <>
                <Typography>
                  Do you want to delete your Account ?
                  <Typography color="error">
                    This will delete all your posts, user information
                  </Typography>
                </Typography>
                <Stack direction={"row"}>
                  <Button color="error" onClick={deleteAccount}>
                    <WarningIcon />
                    Delete
                  </Button>
                  <Button onClick={() => setdelete(!isDelete)}>Cancel</Button>
                </Stack>
              </>
            ) : (
              ""
            )}
          </>
        ) : null}
      </Stack>
    </Card>
  );
}

export default Sidebar