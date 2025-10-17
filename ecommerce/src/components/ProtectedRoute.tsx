import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optional spinner
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
