import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useAuth } from "../../../Auth";
import { VenueForm } from "../../../Forms/UpdateVenueForm";
import { useParams } from "react-router-dom";

export const UpdateVenue = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const apiKey = process.env.REACT_APP_API_KEY;
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!user || !user.token) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const response = await axios.get(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-Noroff-Api-Key": apiKey,
            },
          }
        );

        if (response.status === 200) {
          setFormData(response.data.data);
        } else {
          console.error("Error fetching venue data");
          setError("Error fetching venue data");
        }
      } catch (error) {
        console.error("Error fetching venue data:", error);
        setError("Error fetching venue data");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [user, id, apiKey]);

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
    if (!user || !user.token) {
      alert("You must be logged in to update a venue.");
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
      const response = await axios.put(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        formData,
        config
      );
      console.log("Venue updated successfully:", response.data);
      // Navigate to another page or indicate success
    } catch (error) {
      console.error("Error updating venue:", error);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!formData) {
    return <p>No venue data available.</p>;
  }

  return (
    <VenueForm
      formData={formData}
      handleChange={handleChange}
      handleMediaChange={handleMediaChange}
      addMedia={addMedia}
      handleSubmit={handleSubmit}
    />
  );
};
