import React, { useState } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import Routing from './Routing';
import AuthProvider from "./context/AuthContext";
import Topbar from './components/Topbar';

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Topbar />
        <Routing />
      </Router>
    </AuthProvider>
  );
}

export default App
