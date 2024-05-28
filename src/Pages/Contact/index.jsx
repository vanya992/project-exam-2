import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ContactForm } from "../../Forms/ContactForm";
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
        <ContactForm />
      </Helmet>
    </main>
  );
};
