import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ allowedRoles }) {
  const userRole = localStorage.getItem("userRole"); // Get role from localStorage
  const userToken = localStorage.getItem("token");

  // If the user is not logged in or role is not allowed, redirect to login
  if (!userToken) {
    return <Navigate to="/login" />;
  }

  // Check if the user has one of the allowed roles
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page if role does not match
  }

  return <Outlet />; // Render the child routes if the role is valid
}

export default PrivateRoute;
