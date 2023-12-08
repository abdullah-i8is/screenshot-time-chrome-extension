import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './login';
import Timer from './popup';

function App() {
  
  const token = localStorage.getItem('token');

  const routingConfig = {
    routes: [
      {
        path: '/',
        component: Timer,
      },
      {
        path: "/login",
        component: SignIn,
      }
    ],
  };

  return (
    <Router routes={routingConfig.routes}>
      {token !== null ? <Timer /> : <SignIn />}
    </Router>
  );
}

export default App;