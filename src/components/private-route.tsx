import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null && token !== "";

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  return element;
};

export default PrivateRoute;
