import React, { createContext, useState} from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLogged, setLogged] = useState(false)
  const [isEdit, setisEdit] = useState(false)
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null)
  const [loggedId, setLoggedId] = useState(null)
  // state for searchinh users
  const [searchResult, setSearchResult] = useState([])
  const Login = (userData) => {
    console.log('received from session ', userData)
    const {token,user} = userData
    setUser(user)
    setLoggedId(user._id)
    setToken(token)
    setLogged(true)
  };

  const Logout = () => {
    setUser(null);
     setToken(null)
     setLogged(false)
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLogged,
        setLogged,
        token,
        Login,
        Logout,
        isEdit,
        setisEdit,
        loggedId,
        searchResult,
        setSearchResult
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
