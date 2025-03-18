import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { searchProfiles } from "../api";

function Topbar() {
  const { user, isLogged, isEdit, setisEdit , setSearchResult, token} = useContext(AuthContext);
  const [option, setOption] = useState("username");
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  // to update profile 
  function navigateProfile() {
    setisEdit(true);
    navigate("/register");
  }

 async function searchTerm(){
    console.log(token, search)
    const response =  await searchProfiles(search,token)
    console.log('response ', response)
     setSearchResult(response)
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white", color: "black", mb: 2 }}>
      <Toolbar sx={{ display: "flex", flexDirection : {sm : 'row', xs : 'column', md : 'row', lg : 'row'}, justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          fontFamily={"Poppins, sans-serif"}
          fontWeight={600}
          fontSize={"2em"}
          color="secondary"
          onClick={() => navigate('/')}
        >
          Snap It
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <InputBase
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ border: "2px solid gray", px: 1, borderRadius: 1 }}
          />
          <Button color="primary" variant="contained" onClick={searchTerm}>
            Search
          </Button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <Select value={option} onChange={handleChange} size="small">
            <MenuItem value="username">
              {isLogged ? user.username : "username"}
            </MenuItem>
            <MenuItem value="Update Profile" onClick={navigateProfile}>
              Update Profile
            </MenuItem>
            <MenuItem value="Logout">Logout</MenuItem>
          </Select>

          <IconButton>
            <Avatar src={isLogged ? user.profilePicture : ""} />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
