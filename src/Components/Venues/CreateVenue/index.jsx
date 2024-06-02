import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../Auth";
import { CreateVenueForm } from "../../../Forms/CreateVenueForm";
import { Helmet } from "react-helmet";

export const CreateVenue = () => {
  const { user } = useAuth();
  const apiKey = process.env.REACT_APP_API_KEY;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [{ url: "", alt: "" }],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      country: "",
      continent: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      const decodedToken = jwtDecode(user.token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        console.error("Token has expired");
      }
    }
  }, [user]);

  useEffect(() => {
    console.log("CreateVenue - user:", user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["wifi", "parking", "breakfast", "pets"].includes(name)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        meta: {
          ...prevFormData.meta,
          [name]: checked,
        },
      }));
    } else if (
      ["address", "city", "zip", "country", "continent"].includes(name)
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          ...prevFormData.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "number" ? parseFloat(value) || "" : value,
      }));
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: {
        ...prevFormData.location,
        country: country,
      },
    }));
  };

  const handleMediaChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const media = [...prevFormData.media];
      media[index][name] = value;
      return { ...prevFormData, media };
    });
  };

  const addMedia = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      media: [...prevFormData.media, { url: "", alt: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token || !user.venueManager) {
      alert("You must be logged in as a venue manager to create a venue.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "X-Noroff-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        "https://v2.api.noroff.dev/holidaze/venues",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-Noroff-Api-Key": apiKey,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage(true);
      } else {
        console.error("Error creating venue");
        alert("There was an error creating the venue.");
      }
    } catch (error) {
      console.error("Error creating venue:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <Helmet>
        <title>Create Venue | Holidaze</title>
      </Helmet>
      <CreateVenueForm
        formData={formData}
        handleChange={handleChange}
        handleCountryChange={handleCountryChange}
        handleMediaChange={handleMediaChange}
        addMedia={addMedia}
        handleSubmit={handleSubmit}
        successMessage={successMessage}
      />
    </main>
  );
};
