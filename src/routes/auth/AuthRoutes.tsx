import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../../pages/Login';
import Signup from '../../pages/Signup';
import ResetPassword from '../../pages/ResetPassword';
import Workspace from '../../pages/Workspace';

export const getAuthRoutes = () => [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="signup" path="/signup" element={<Signup />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />,
  <Route key="workspace" path="/workspace" element={<Workspace />} />,
];
