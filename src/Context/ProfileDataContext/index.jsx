import React, { createContext, useState, useContext } from "react";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  return (
    <UserProfileContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
