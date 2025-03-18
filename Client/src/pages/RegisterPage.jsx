import React, { useEffect, useState, useContext } from "react";
import { useNavigate , Link} from "react-router-dom";
import { Box, Stack, Typography, Button, TextField, Card } from "@mui/material";
import { registerUser, updateProfile } from "../api";
import { styled } from "@mui/system";
import LoginPage from "./LoginPage";
import { AuthContext } from "../context/AuthContext";

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
  },
});

const RegisterPage = () => {
     const {isEdit,setisEdit, user, setUser,token}  = useContext(AuthContext)

     console.log('on first load ', user)

 const [form, setForm] = useState({
   first: "",
   last: "",
   username: "",
   email: "",
   password: "",
   location: "",
   occupation: "",
 });

useEffect(() => {
  if (isEdit) {
    setForm({
      first: user.first || "",
      last: user.last || "",
      username: user.username || "",
      email: user.email || "",
      password: "", 
      location: user.location || "",
      occupation: user.occupation || "",
    });
  }
}, []);



  const navigate = useNavigate();
  const [img, setImg] = useState(null);
  const [profile, setprofile] = useState(null);

  const handleChange = (event) => {
    console.log("Changing:", event.target.name, event.target.value);
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const selectProfile = (event) => {
    const file = event.target.files[0];
    console.log("file ", file);
    if (file) {
      setprofile(file);
      console.log("Selected file:", file);
      const selected = URL.createObjectURL(file);
      console.log("Object URL:", selected);
      setImg(selected);
    }
  };

  const Register = async () => {
    const formdata = new FormData();
     if(profile){
      console.log('profile to be updated..')
       formdata.append("file", profile);
     }
    formdata.append("user", JSON.stringify(form));
    const result = isEdit
      ? await updateProfile(token, formdata)
      : await registerUser(formdata);
    console.log(result);
    if(isEdit){
    //  update user in context api
    setUser(result)
    setisEdit(false)
    }
    if (result.status == 201 || result) {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.3em",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          fontSize: "2em",
        }}
      >
        Register
      </Typography>

      <Card
        sx={{
          width: { xs: "80vw", sm: "70vw", md: "60vw", lg: "50vw" },
          p: "1em",
        }}
      >
        <Stack sx={{ alignItems: "center", gap: "1em" }}>
          <Box>
            {/* Name Fields */}
            <Stack direction={"row"} sx={{ gap: "2em" }}>
              <CustomTextField
                type="text"
                label="First Name"
                name="first"
                value={form.first}
                onChange={handleChange}
                required
              />
              <CustomTextField
                type="text"
                label="Last Name"
                name="last"
                value={form.last}
                onChange={handleChange}
                required
              />
            </Stack>
            {/* Other Fields */}
            <Stack sx={{ gap: "1em" }}>
              <CustomTextField
                type="text"
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
              <CustomTextField
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <CustomTextField
                type="password"
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <CustomTextField
                type="text"
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
              <CustomTextField
                type="text"
                label="Occupation"
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
              />
              <input
                type="file"
                accept="image/*"
                onChange={selectProfile}
                name="file"
              />
              {img && (
                <img
                  src={img}
                  alt="Profile"
                  style={{
                    width: "40%",
                    maxHeight: "40%",
                    borderRadius: "50%",
                    margin: "auto",
                    objectFit: "cover",
                  }}
                />
              )}
              <Button variant="contained" onClick={Register}>
                {isEdit ? "Update" : "Register"}
              </Button>
              <Typography color="error" fontWeight={"bold"}>
                Already have an account ?{" "}
                <Link to="/login">Login</Link>
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default RegisterPage;
