import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import styles from "../Forms.module.css";
import { Helmet } from "react-helmet";
import { useAuth } from "../../Auth";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ toggleForm }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with data:", loginData);
      await login(loginData);
      console.log("Login successful");
      setLoginData({
        email: "",
        password: "",
      });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
      console.error("Login failed:", err.message);
    }
  };

  return (
    <main>
      <Helmet>
        <title>Login | Holidaze</title>
      </Helmet>
      <div className="background">
        <div className={styles.wrapper}>
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className={styles.inputBox}>
              <input
                type="email"
                name="email"
                placeholder="email@stud.noroff.no"
                value={loginData.email}
                onChange={handleInputChange}
                required
              />
              <FaEnvelope className={styles.icon} />
            </div>
            <div className={styles.inputBox}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange}
                required
              />
              <FaLock className={styles.icon} />
            </div>
            <div className={styles.rememberForgot}>
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.registerLink}>
              <p>
                Don't have a profile?{" "}
                <a href="#" onClick={toggleForm}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
