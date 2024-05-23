import React, { useState } from "react";
import { LoginForm } from "../Forms/LoginForm/index.jsx";
import { RegisterForm } from "../Forms/RegisterForm/index.jsx";

export const AuthFormToggle = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <div>
      {isLoginActive ? (
        <LoginForm toggleForm={toggleForm} />
      ) : (
        <RegisterForm toggleForm={toggleForm} />
      )}
    </div>
  );
};
