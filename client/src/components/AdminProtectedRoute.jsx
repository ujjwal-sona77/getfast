import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const [user, setUser] = useState({});
  const getEmailFromToken = () => {
    try {
      const token = document.cookie.split("=")[1];
      if (!token) {
        return null;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email;
    } catch (err) {
      setError("Invalid authentication token");
      return null;
    }
  };

  const email = getEmailFromToken();
  const getUser = async () => {
    try {
      if (!email) return; // Check if email is null before making the request
      const response = await axios.get(`/api/user/profile/${email}`);
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user profile:", err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  if (user.isAdmin != true) {
    alert("error");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
