import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import styles from "../Forms.module.css";

export const RegisterForm = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: { url: "", alt: "" },
    venueManager: false,
  });
  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (name.includes(".")) {
      const [fieldName, subField] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          [subField]: value,
        },
      }));
    } else {
      validateField(name, value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "name":
        errorMessage = /^[a-zA-Z0-9_]+$/.test(value)
          ? ""
          : "Name can only use a-Z, 0-9, and _";
        break;
      case "email":
        errorMessage = value.endsWith("@stud.noroff.no")
          ? ""
          : "Only stud.noroff.no emails are allowed to register";
        break;
      case "password":
        errorMessage =
          value.length >= 8 ? "" : "Password must be at least 8 characters";
        break;
      case "avatar.url":
        errorMessage =
          value && /\.(jpg|jpeg|png|webp|avif|gif)$/.test(value)
            ? ""
            : "Image URL must be valid URL";
        break;
      default:
        errorMessage = "";
    }
    setErrors((errors) => ({ ...errors, [name]: errorMessage }));
    return errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formIsValid = !Object.values(errors).some(
      (error) => error.length > 0
    );
    if (!formIsValid) {
      console.error("Fix errors before submitting:", errors);
      return;
    }

    console.log("Form data before submission:", formData);

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Registering with data:", JSON.stringify(formData));

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.errors
            ? data.errors.map((err) => err.message).join(", ")
            : "Registration failed with no error message."
        );
      }

      console.log("User registered:", data);
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration failed:", err.message);
    }
  };

  return (
    <main>
      <Helmet>
        <title>Register | Holidaze</title>
      </Helmet>
      <div className="background">
        <div className={styles.wrapper}>
          {isRegistered ? (
            <div>
              <p>
                You have successfully registered your profile. Go to the{" "}
                <a href="/login">login</a> page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1>Register</h1>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  onChange={handleInputChange}
                  required
                />
                <FaUser className={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="email"
                  name="email"
                  placeholder="email@stud.noroff.no"
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
                  onChange={handleInputChange}
                  required
                />
                <FaLock className={styles.icon} />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="url"
                  name="avatar.url"
                  placeholder="Avatar URL"
                  value={formData.avatar.url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.venueManager}>
                <label>
                  <input
                    type="checkbox"
                    name="venueManager"
                    checked={formData.venueManager}
                    onChange={handleInputChange}
                  />
                  Venue Manager
                </label>
              </div>
              <div className={styles.rememberForgot}>
                <label>
                  <input type="checkbox" /> I agree to the terms & conditions
                </label>
              </div>
              <button type="submit" onClick={handleSubmit}>
                Register
              </button>
              <div className={styles.registerLink}>
                <p>
                  Already have an account?{" "}
                  <a href="" onClick={toggleForm}>
                    Login
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};
