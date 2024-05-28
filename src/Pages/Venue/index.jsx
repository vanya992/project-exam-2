import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../../Hooks/useFetch";
import { Helmet } from "react-helmet";
import {
  FaArrowLeft,
  FaPaw,
  FaStar,
  FaUtensils,
  FaWifi,
  FaParking,
} from "react-icons/fa";
import { DateRangePicker } from "../../Components/DatePicker/DateRangePicker";
import { useAuth } from "../../Auth";
import styles from "./Venue.module.css";
import { formatDate } from "../../Util/DateFormating";

const defaultImageUrl =
  "https://cdn.vectorstock.com/i/500p/82/99/no-image-available-like-missing-picture-vector-43938299.jpg";

export const Venue = () => {
  let { id } = useParams();
  const { data, isLoading, isError } = useFetch(
    `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`
  );
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (data?.bookings) {
      setBookings(data.bookings);
    }
  }, [data]);

  const handleThumbnailClick = (index) => {
    setMainImageIndex(index);
  };

  const handleBookingSuccess = (newBooking) => {
    setBookings([...bookings, newBooking.data]);
  };

  const handleImageError = (e) => {
    e.target.src = defaultImageUrl;
  };

  const isOwner = user && data?.owner?.name === user.name;

  let content;

  if (isError) {
    content = <div>There was an error loading data.</div>;
  } else if (isLoading || !data) {
    content = <div>Loading...</div>;
  } else {
    const images =
      data.media && data.media.length > 0
        ? data.media
        : [{ url: defaultImageUrl, alt: "No image available" }];

    content = (
      <>
        <section className={styles.heroSection}>
          <div className={styles.mainImageContainer}>
            <img
              src={images[mainImageIndex].url}
              alt={images[mainImageIndex].alt}
              onError={handleImageError}
              className={styles.mainImage}
            />
            <div className={styles.imageOverlay}>
              <h1 className={styles.venueName}>{data.name}</h1>
              <p className={styles.venueDescription}>{data.description}</p>
            </div>
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  onError={handleImageError}
                  onClick={() => handleThumbnailClick(index)}
                  className={`${styles.thumbnail} ${
                    index === mainImageIndex ? styles.activeThumbnail : ""
                  }`}
                />
              ))}
            </div>
          )}
        </section>
        <div className={styles.contentContainer}>
          <div className={styles.infoSection}>
            {data.owner && (
              <Link
                to={`/profile/${data.owner.name}`}
                className={styles.ownerLink}
              >
                <div className={styles.ownerCard}>
                  <img
                    src={data.owner.avatar.url || defaultImageUrl}
                    alt={data.owner.avatar.alt || data.owner.name}
                    className={styles.ownerAvatar}
                    onError={handleImageError}
                  />
                  <h2>{data.owner.name}</h2>
                </div>
              </Link>
            )}
            <div className={styles.venueCard}>
              <h2>{data.name}</h2>
              <p>{data.description}</p>
              <p>
                <b>Created:</b> {formatDate(data.created)}
              </p>
              <p>
                <b>Price/day:</b> ${data.price}
              </p>
              <p>
                <b>Max guests:</b> {data.maxGuests}
              </p>
              <p>
                {data.rating !== undefined && (
                  <>
                    <FaStar className={styles.star} /> {data.rating}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className={styles.amenitiesSection}>
            <h2>Amenities</h2>
            <ul className={styles.amenitiesGrid}>
              {data.meta?.breakfast && (
                <li>
                  <FaUtensils /> Breakfast Included
                </li>
              )}
              {data.meta?.wifi && (
                <li>
                  <FaWifi /> WiFi
                </li>
              )}
              {data.meta?.parking && (
                <li>
                  <FaParking /> Parking
                </li>
              )}
              {data.meta?.pets && (
                <li>
                  <FaPaw /> Pets Allowed
                </li>
              )}
            </ul>
          </div>
          <div className={styles.bookingSection}>
            <h3>Book This Venue</h3>
            <DateRangePicker
              venue={data}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
          {isOwner && (
            <div className={styles.bookingsSection}>
              <h3>Bookings</h3>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className={styles.booking}>
                    <p>
                      <b>Customer:</b> {booking.customer.name}
                    </p>
                    <p>
                      <b>From:</b> {formatDate(booking.dateFrom)}
                    </p>
                    <p>
                      <b>To:</b> {formatDate(booking.dateTo)}
                    </p>
                    <p>
                      <b>Guests:</b> {booking.guests}
                    </p>
                  </div>
                ))
              ) : (
                <p>No bookings yet.</p>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <main className={styles.venuePage}>
      <Helmet>
        <title>{`${data?.name || "Venue"} | Holidaze`}</title>
      </Helmet>
      <Link to="/venues" className={styles.backLink}>
        <FaArrowLeft /> Back to Venues
      </Link>
      {content}
    </main>
  );
};
