import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../VenueForms.module.css";
import { FaUtensils, FaWifi, FaPaw } from "react-icons/fa";
import { FaSquareParking } from "react-icons/fa6";
import countryList from "react-select-country-list";

export const CreateVenueForm = ({
  formData,
  handleChange,
  handleCountryChange,
  handleMediaChange,
  addMedia,
  handleSubmit,
  successMessage,
}) => {
  const [imagePreviews, setImagePreviews] = useState(
    formData.media.map(() => "")
  );
  const countries = countryList().getData();

  const handleMediaChangeWithPreview = (index, e) => {
    handleMediaChange(index, e);
    const { value } = e.target;
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = value;
      return newPreviews;
    });
  };

  if (successMessage) {
    return (
      <div className={styles.successMessage}>
        <h2>Congratulations, Venue created successfully!</h2>
        <p>
          <Link to="/venues">Go check other venues</Link> or{" "}
          <Link to="/createVenue">create a new one</Link>.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          required
        />
      </label>
      <div className={styles.inlineGroup}>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Max Guests:
          <input
            type="number"
            name="maxGuests"
            value={formData.maxGuests || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            value={formData.rating || ""}
            onChange={handleChange}
          />
        </label>
      </div>
      <fieldset className={styles.amenities}>
        <legend>Amenities:</legend>
        <label>
          <FaWifi /> WiFi
          <input
            type="checkbox"
            name="wifi"
            checked={formData.meta.wifi || false}
            onChange={handleChange}
          />
        </label>
        <label>
          <FaSquareParking /> Parking
          <input
            type="checkbox"
            name="parking"
            checked={formData.meta.parking || false}
            onChange={handleChange}
          />
        </label>
        <label>
          <FaUtensils /> Breakfast
          <input
            type="checkbox"
            name="breakfast"
            checked={formData.meta.breakfast || false}
            onChange={handleChange}
          />
        </label>
        <label>
          <FaPaw /> Pets
          <input
            type="checkbox"
            name="pets"
            checked={formData.meta.pets || false}
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <fieldset>
        <legend>Location:</legend>
        <div className={styles.inlineGroup}>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.location.address || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.location.city || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className={styles.inlineGroup}>
          <label>
            Country:
            <select
              name="country"
              value={formData.location.country || ""}
              onChange={handleCountryChange}
              className={styles.country}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.label} value={country.label}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Continent:
            <input
              type="text"
              name="continent"
              value={formData.location.continent || ""}
              onChange={handleChange}
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Media:</legend>
        {formData.media.map((mediaItem, index) => (
          <div key={index}>
            <label>
              URL:
              <input
                type="url"
                name="url"
                value={mediaItem.url || ""}
                onChange={(e) => handleMediaChangeWithPreview(index, e)}
              />
            </label>
            {imagePreviews[index] && (
              <img
                src={imagePreviews[index]}
                alt={`Preview ${index}`}
                className={styles.imagePreview}
              />
            )}
            <label>
              Alt Text:
              <input
                type="text"
                name="alt"
                value={mediaItem.alt || ""}
                onChange={(e) => handleMediaChange(index, e)}
              />
            </label>
          </div>
        ))}
        <button className="ctaButton" type="button" onClick={addMedia}>
          Add Media
        </button>
      </fieldset>
      <button className="ctaButton" type="submit">
        Create Venue
      </button>
    </form>
  );
};
