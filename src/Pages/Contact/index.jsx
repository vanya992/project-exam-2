import React, { useState } from "react";
import { Helmet } from "react-helmet";
import styles from "./Contact.module.css";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  return (
    <main className={styles.bg}>
      <Helmet>
        <title>Contact | Holidaze</title>
      </Helmet>
      <div className={styles.formBox}>
        <h1>Contact Us</h1>
        <div>
          <form>
            <label>Name</label>
            <input type="text" name="name" placeholder="Name" required />
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" required />
            <label>Subject</label>
            <input type="text" name="subject" placeholder="Subject" required />
            <label>Message</label>
            <textarea
              name="message"
              placeholder="How can we help you?"
              required
            />
          </form>
        </div>
      </div>
    </main>
  );
};
