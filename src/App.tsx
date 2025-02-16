import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import AppointmentList from "./components/appointment-list";
import PrivateRoute from "./components/private-route";
import { setAuthToken } from "./api";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/getAppointments"
          element={<PrivateRoute element={<AppointmentList />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
