import styles from "../VenueForms.module.css";

export const UpdateVenueForm = ({
  formData,
  handleChange,
  handleMediaChange,
  addMedia,
  handleSubmit,
}) => {
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
          WiFi:
          <input
            type="checkbox"
            name="wifi"
            checked={formData.meta.wifi || false}
            onChange={handleChange}
          />
        </label>
        <label>
          Parking:
          <input
            type="checkbox"
            name="parking"
            checked={formData.meta.parking || false}
            onChange={handleChange}
          />
        </label>
        <label>
          Breakfast:
          <input
            type="checkbox"
            name="breakfast"
            checked={formData.meta.breakfast || false}
            onChange={handleChange}
          />
        </label>
        <label>
          Pets:
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
          <label>
            Country:
            <input
              type="text"
              name="country"
              value={formData.location.country || ""}
              onChange={handleChange}
            />
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
                onChange={(e) => handleMediaChange(index, e)}
              />
            </label>
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
        <button type="button" onClick={addMedia}>
          Add Media
        </button>
      </fieldset>
      <button type="submit">Update Venue</button>
    </form>
  );
};
