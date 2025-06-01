import React from 'react';
import {Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import {OAuthSignInPage} from "./pages/OAuthSignInPage";
import {OAuthCallBack} from "./pages/OAuthCallBack";
import { Profile } from './pages/Profile';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<OAuthSignInPage />} />
              <Route path="/callback/:oAuthType/:mode" element={<OAuthCallBack />} />
              <Route path="/profile" element={<Profile />} />
          </Routes>
      </Router>
  );
}

export default App;
