import React, { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import { Box, Stack, Typography, Button, TextField, Card } from "@mui/material";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const LoginPage = () => {
  const {Login} = useContext(AuthContext)
   const [login, setlogin] = useState({
     username : '',
     password : ''
   })
   const [msg, setMsg] = useState('')
   const navigate = useNavigate()
   const handleChange = (event) => {
        setlogin({
          ...login,
          [event.target.name] : event.target.value
        })
   }

  const handleLogin = async() => {
      const result = await loginUser(login)
      setMsg(result)
      const {token,user} = result
      if(result){
        sessionStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('loggedId', user._id)
        sessionStorage.setItem('isLogged', true)
        Login({user,token})
        navigate('/')
      }
  }

  return (
    <Stack sx={{ height: "80vh", justifyContent: "center" }}>
      <Stack gap={"2em"} alignItems={"center"}>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "3em",
          }}
        >
          Snap It,{" "}
          <Typography color="error" fontSize={"0.4em"} fontWeight={"bold"}>
            Lets Connect together
          </Typography>
        </Typography>
        <Card
          sx={{
            display: "flex",
            width: { xs: "90vw", sm: "80vw", md: "70vw", lg: "50vw" },
          }}
        >
          <Stack gap={"1em"} sx={{ width: "100%", m: "3em" }}>
            <TextField
              type="text"
              label="username"
              variant="outlined"
              name="username"
              onChange={handleChange}
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              name="password"
              onChange={handleChange}
            />
            <Button variant="outlined" onClick={handleLogin}>
              Login
            </Button>
            <Typography color="error" fontWeight={"bold"}>
              Don't have an acccount ?{" "}
              <Link to="/register">Create Account</Link>
            </Typography>
          </Stack>
        </Card>
        <Typography color="error"> {msg ? msg : null}</Typography>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
