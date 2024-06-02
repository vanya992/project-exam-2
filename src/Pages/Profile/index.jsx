import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../Auth";
import styles from "./Profile.module.css";
import axios from "axios";
import { UpdateProfileForm } from "../../Forms/UpdateProfileForm";
import { Loader } from "../../Components/Loader";
import { UpdateBookingForm } from "../../Forms/UpdateBookingForm";

const defaultAvatarUrl =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export const Profile = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const isLoggedInUser = !username || username === user?.name;
  const apiKey = process.env.REACT_APP_API_KEY;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userToFetch = username || user?.name;
      if (!userToFetch || !apiKey) {
        console.error("Username or API key is not defined");
        return;
      }
      console.log("Fetching profile data for user:", userToFetch);
      console.log("API Key:", apiKey);

      const url = `https://v2.api.noroff.dev/holidaze/profiles/${userToFetch}?_bookings=true&_venues=true`;
      console.log("Profile fetch URL:", url);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
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

    if (user || username) {
      fetchProfileData();
    }
  }, [username, apiKey, user]);

  const deleteVenue = async (venueId) => {
    if (!isLoggedInUser || !user || !user.token) {
      alert("You must be logged in to delete a venue.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirmDelete) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "X-Noroff-Api-Key": apiKey,
      },
    };

    try {
      const response = await axios.delete(
        `https://v2.api.noroff.dev/holidaze/venues/${venueId}`,
        config
      );
      if (response.status === 204) {
        alert("Venue deleted successfully");
        setProfileData((prevData) => ({
          ...prevData,
          venues: prevData.venues.filter((venue) => venue.id !== venueId),
        }));
      } else {
        console.error("Error deleting venue");
        setError("Error deleting venue");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
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

  const deleteBooking = async (bookingId) => {
    if (!isLoggedInUser || !user || !user.token) {
      alert("You must be logged in to delete a booking.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "X-Noroff-Api-Key": apiKey,
      },
    };

    try {
      const response = await axios.delete(
        `https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`,
        config
      );
      if (response.status === 204) {
        alert("Booking deleted successfully");
        setProfileData((prevData) => ({
          ...prevData,
          bookings: prevData.bookings.filter(
            (booking) => booking.id !== bookingId
          ),
        }));
      } else {
        console.error("Error deleting booking");
        setError("Error deleting booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
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

  const openUpdateModal = (booking) => {
    setCurrentBooking(booking);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentBooking(null);
  };

  const updateBooking = async (bookingId, updatedBookingData) => {
    if (!isLoggedInUser || !user || !user.token) {
      alert("You must be logged in to update a booking.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "X-Noroff-Api-Key": apiKey,
      },
    };

    try {
      const response = await axios.put(
        `https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`,
        updatedBookingData,
        config
      );
      if (response.status === 200) {
        alert("Booking updated successfully");
        setProfileData((prevData) => ({
          ...prevData,
          bookings: prevData.bookings.map((booking) =>
            booking.id === bookingId ? response.data.data : booking
          ),
        }));
        closeUpdateModal();
      } else {
        console.error("Error updating booking");
        setError("Error updating booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
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

  const handleImageError = (e) => {
    e.target.src = defaultAvatarUrl;
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  if (loading) {
    return (
      <div>
        <Loader loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div>
      <div className={styles.profileContainer}>
        <div className={styles.sidebar}>
          <div className={styles.avatar}>
            <img
              src={profileData.avatar?.url || defaultAvatarUrl}
              alt={profileData.avatar?.alt || "Default Avatar"}
              onError={handleImageError}
            />
          </div>
          {isLoggedInUser && (
            <button className="ctaButton" onClick={() => setIsFormOpen(true)}>
              Update Profile
            </button>
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
                  {booking.venue &&
                    booking.venue.media &&
                    booking.venue.media.length > 0 && (
                      <img
                        src={booking.venue.media[0].url}
                        alt={booking.venue.media[0].alt}
                        className={styles.bookingImage}
                      />
                    )}
                  <div className={styles.bookingInfo}>
                    <h3>{booking.venue?.name}</h3>
                    <p>
                      From: {new Date(booking.dateFrom).toLocaleDateString()}
                    </p>
                    <p>To: {new Date(booking.dateTo).toLocaleDateString()}</p>
                    <p>Guests: {booking.guests}</p>
                  </div>
                  {isLoggedInUser && (
                    <div className={styles.buttons}>
                      <button
                        className="ctaButton"
                        onClick={() => openUpdateModal(booking)}
                      >
                        Update
                      </button>
                      <button
                        className="ctaButton"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>
                You haven't made any bookings yet. What are you waiting for? Go
                check our <Link to="/venues">venues</Link> page.
              </p>
            )}
          </div>
          <hr />
          {profileData.venueManager && (
            <div className={styles.venues}>
              <h2>Your Venues</h2>
              {profileData.venues && profileData.venues.length > 0 ? (
                profileData.venues.map((venue) => (
                  <div key={venue.id} className={styles.venue}>
                    <Link to={`/venue/${venue.id}`}>
                      {venue.media && venue.media.length > 0 && (
                        <img
                          src={venue.media[0].url}
                          alt={venue.media[0].alt}
                          className={styles.venueImage}
                        />
                      )}
                    </Link>
                    <div className={styles.venueInfo}>
                      <h3>{venue.name}</h3>
                      <p>{venue.description}</p>
                      <p>Price: ${venue.price}</p>
                      <p>Max Guests: {venue.maxGuests}</p>
                    </div>
                    {isLoggedInUser && (
                      <div className={styles.buttons}>
                        <div>
                          <Link to={`/update-venue/${venue.id}`}>
                            <button className="ctaButton">Update</button>
                          </Link>
                        </div>
                        <div>
                          <button
                            className="ctaButton"
                            onClick={() => deleteVenue(venue.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No venues available.</p>
              )}
            </div>
          )}
          {isLoggedInUser && (
            <div
              className={`${styles.updateFormContainer} ${
                isFormOpen ? styles.open : ""
              }`}
            >
              <UpdateProfileForm
                user={user}
                apiKey={apiKey}
                profileData={profileData}
                setProfileData={setProfileData}
                closeForm={() => setIsFormOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
      {isUpdateModalOpen && currentBooking && (
        <div className={styles.updateModal}>
          <UpdateBookingForm
            booking={currentBooking}
            bookings={profileData.bookings}
            onUpdate={updateBooking}
            onClose={closeUpdateModal}
          />
        </div>
      )}
    </div>
  );
};
