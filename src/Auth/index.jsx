import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");
    const venueManager = localStorage.getItem("venueManager") === "true";

    if (authToken && userName) {
      setUser({
        token: authToken,
        name: userName,
        venueManager,
      });
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.data.accessToken;
        const user = data.data.name;
        const venueManager = data.data.venueManager || false;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", user);
        localStorage.setItem("venueManager", venueManager.toString());

        setUser({ token, name: user, venueManager });

        navigate("/profile");
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.errors[0]?.message || "Unknown error during login"
        );
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("venueManager");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
