// import React, { useContext, useState } from "react";
// import { AppBar, Toolbar, Button, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const Navbar = () => {
//   const { user, logout, setSearchResult } = useContext(AuthContext);


//   return (
//     <AppBar position="sticky">
//       <Toolbar>
//         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//           Social Media
//         </Typography>
//         <Button color="inherit" component={Link} to="/">
//           Home
//         </Button>
//         {user ? (
//           <>
//             <Button
//               color="inherit"
//               component={Link}
//               to={`/profile/${user._id}`}
//             >
//               Profile
//             </Button>
//             <Button color="inherit" onClick={logout}>
//               Logout
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button color="inherit" component={Link} to="/login">
//               Login
//             </Button>
//             <Button color="inherit" component={Link} to="/register">
//               Register
//             </Button>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
