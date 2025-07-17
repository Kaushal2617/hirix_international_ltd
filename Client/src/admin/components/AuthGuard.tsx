import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  // Check if user is authenticated and is admin
  if (!user || user.role !== 'admin') {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;