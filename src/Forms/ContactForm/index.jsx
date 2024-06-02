import { useState } from "react";
import styles from "./ContactForm.module.css";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    role: "",
  });

  const [isSubmited, setIsSubmited] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmited(true);
  };

  if (isSubmited) {
    return (
      <div className={styles.submitSuccess}>Your message has been sent.</div>
    );
  }

  return (
    <div className={styles.formBox}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.groupFields}>
          <div className={styles.fieldHolder}>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className={styles.fieldHolder}>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
        </div>
        <div className={styles.groupFields}>
          <div className={styles.fieldHolder}>
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />{" "}
            <label htmlFor="subject">Subject</label>
          </div>
          <div className={styles.fieldHolder}>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
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
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <label htmlFor="message">Message</label>
        </div>
        <button className="ctaButton" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
