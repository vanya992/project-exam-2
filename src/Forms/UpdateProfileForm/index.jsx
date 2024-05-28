import React, { useState } from "react";
import axios from "axios";
import styles from "./UpdateProfileForm.module.css";

export const UpdateProfileForm = ({
  user,
  apiKey,
  profileData,
  setProfileData,
  closeForm,
}) => {
  const [bio, setBio] = useState(profileData?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profileData?.avatar?.url || "");
  const [avatarAlt, setAvatarAlt] = useState(profileData?.avatar?.alt || "");
  const [venueManager, setVenueManager] = useState(
    profileData?.venueManager || false
  );

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert("You must be logged in to update the profile.");
      return;
    }

    const updatedProfile = {
      bio,
      avatar: {
        url: avatarUrl,
        alt: avatarAlt,
      },
      venueManager,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "X-Noroff-Api-Key": apiKey,
      },
    };

    try {
      const response = await axios.put(
        `https://v2.api.noroff.dev/holidaze/profiles/${user.name}`,
        updatedProfile,
        config
      );

      if (response.status === 200) {
        alert("Profile updated successfully");
        setProfileData(response.data.data);
        closeForm();
      } else {
        throw new Error("Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("There was an error with the update.");
    }
  };

  return (
    <div className={styles.updateProfile}>
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdateProfile} className={styles.updateForm}>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={styles.formControl}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="avatarUrl">Avatar URL:</label>
          <input
            type="url"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className={styles.formControl}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="avatarAlt">Avatar Alt Text:</label>
          <input
            type="text"
            id="avatarAlt"
            value={avatarAlt}
            onChange={(e) => setAvatarAlt(e.target.value)}
            className={styles.formControl}
          />
        </div>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={venueManager}
              onChange={() => setVenueManager(!venueManager)}
            />
            Venue Manager
          </label>
        </div>
        <button type="submit" className="ctaButton">
          Update Profile
        </button>
      </form>
      <button onClick={closeForm} className="ctaButton">
        Close
      </button>
    </div>
  );
};
