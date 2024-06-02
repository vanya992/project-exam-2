import { Navigate } from "react-router-dom";
import { useAuth } from "../index";

export const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  console.log("PrivateRoute user:", user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
