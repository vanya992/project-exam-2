import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth";
import styles from "./Profile.module.css";
import { Link } from "react-router-dom";

export const Profile = () => {
  const { user } = useAuth();
  const apiKey = process.env.REACT_APP_API_KEY;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !user.name || !apiKey) {
        console.error("User, user name, or API key is not defined");
        return;
      }
      console.log("Fetching profile data for user:", user.name);
      console.log("API Key:", apiKey);

      const url = `https://v2.api.noroff.dev/holidaze/profiles/${user.name}?_bookings=true&_venues=true`;
      console.log("Profile fetch URL:", url);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-Noroff-Api-Key": apiKey,
          },
        });

        console.log("Profile fetch response status:", response.status);

        const data = await response.json();

        if (response.ok) {
          console.log("Fetched profile data:", data);
          setProfileData(data.data);
        } else {
          console.error("Error response:", data);
          throw new Error(data.errors[0]?.message || "Unknown error");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.name && apiKey) {
      fetchProfileData();
    }
  }, [user, apiKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebar}>
        {profileData.avatar && (
          <div className={styles.avatar}>
            <img src={profileData.avatar.url} alt={profileData.avatar.alt} />
          </div>
        )}
        <div className={styles.info}>
          <h1>{profileData.name}</h1>
          <p>{profileData.email}</p>
          <p>{profileData.bio}</p>
          {profileData.venueManager && <p>Venue Manager</p>}
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.bookings}>
          <h2>Your Bookings</h2>
          {profileData.bookings && profileData.bookings.length > 0 ? (
            profileData.bookings.map((booking) => (
              <div key={booking.id} className={styles.booking}>
                {booking.venue.media && booking.venue.media.length > 0 && (
                  <img
                    src={booking.venue.media[0].url}
                    alt={booking.venue.media[0].alt}
                    className={styles.bookingImage}
                  />
                )}
                <div className={styles.bookingInfo}>
                  <h3>{booking.venue.name}</h3>
                  <p>From: {new Date(booking.dateFrom).toLocaleDateString()}</p>
                  <p>To: {new Date(booking.dateTo).toLocaleDateString()}</p>
                  <p>Guests: {booking.guests}</p>
                </div>
              </div>
            ))
          ) : (
            <p>
              You haven't made any bookings yet. What are you waiting? Go check
              our <Link to="/venues">venues</Link> page.
            </p>
          )}
        </div>
        {profileData.venueManager && (
          <div className={styles.venues}>
            <h2>Your Venues</h2>
            {profileData.venues && profileData.venues.length > 0 ? (
              profileData.venues.map((venue) => (
                <div key={venue.id} className={styles.venue}>
                  {venue.media && venue.media.length > 0 && (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt}
                      className={styles.venueImage}
                    />
                  )}
                  <div className={styles.venueInfo}>
                    <h3>{venue.name}</h3>
                    <p>{venue.description}</p>
                    <p>Price: ${venue.price}</p>
                    <p>Max Guests: {venue.maxGuests}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No venues available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
