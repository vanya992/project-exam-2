import React from "react";
import styles from "./ContactForm.module.css";

export const ContactForm = () => {
  return (
    <div className={styles.formBox}>
      <h1>Contact Us</h1>
      <form className={styles.formContainer}>
        <div className={styles.groupFields}>
          <div className={styles.fieldHolder}>
            <input type="text" name="name" id="name" required />
            <label htmlFor="name">Name</label>
          </div>
          <div className={styles.fieldHolder}>
            <input type="email" name="email" id="email" required />
            <label htmlFor="email">Email</label>
          </div>
        </div>
        <div className={styles.groupFields}>
          <div className={styles.fieldHolder}>
            <input type="text" name="subject" id="subject" required />{" "}
            <label htmlFor="subject">Subject</label>
          </div>
          <div className={styles.fieldHolder}>
            <select name="role" id="role" required>
              <option value="" disabled selected hidden>
                Select Role
              </option>
              <option value="customer">Customer</option>
              <option value="venueManager">Venue Manager</option>
            </select>
            <label htmlFor="role">Role</label>
          </div>
        </div>
        <div className={styles.fieldHolder} style={{ width: "100%" }}>
          <textarea name="message" id="message" required></textarea>
          <label htmlFor="message">Message</label>
        </div>
      </form>
    </div>
  );
};
