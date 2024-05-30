import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");
    const venueManager = localStorage.getItem("venueManager") === "true";

    console.log("useEffect - AuthProvider:", {
      authToken,
      userName,
      venueManager,
    });

    if (authToken && typeof authToken === "string" && userName) {
      const decodedToken = jwtDecode(authToken);
      console.log("Decoded Token on load:", decodedToken);

      // Bypass the expiration check
      setUser({
        token: authToken,
        name: userName,
        venueManager,
      });
    } else {
      localStorage.removeItem("authToken");
    }
  }, []);

  const fetchUserProfile = async (token, userName) => {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-Api-Key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const venueManager = data.data.venueManager || false;

        console.log("fetchUserProfile - response data:", { venueManager });

        localStorage.setItem("venueManager", venueManager.toString());

        setUser((prevUser) => ({
          ...prevUser,
          venueManager,
        }));
      } else {
        console.error("Error fetching user profile");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error.message);
    }
  };

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

        console.log("login - response data:", { token, user });

        const decodedToken = jwtDecode(token);
        console.log("Decoded Token after login:", decodedToken);

        // Bypass the expiration check
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", user);

        setUser({ token, name: user, venueManager: false });

        await fetchUserProfile(token, user);

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
