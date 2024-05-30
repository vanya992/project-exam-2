import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ContactForm } from "../../Forms/ContactForm";

export const Contact = () => {
  return (
    <main>
      <Helmet>
        <title>Contact | Holidaze</title>
      </Helmet>
      <ContactForm />
    </main>
  );
};
