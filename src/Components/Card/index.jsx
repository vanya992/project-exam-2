import React from "react";
import styles from "./Card.module.css";
import { FaStar, FaMapPin } from "react-icons/fa";
import { Link } from "react-router-dom";

const defaultImageUrl =
  "https://cdn.vectorstock.com/i/500p/82/99/no-image-available-like-missing-picture-vector-43938299.jpg";

export const Card = ({ venue }) => {
  const imageUrl =
    venue.media && venue.media.length > 0
      ? venue.media[0].url
      : defaultImageUrl;
  const imageAlt =
    venue.media && venue.media.length > 0
      ? venue.media[0].alt
      : "default image";

  return (
    <div className={styles.card}>
      <div className={styles.media}>
        <Link to={`/venue/${venue.id}`}>
          <img src={imageUrl} alt={imageAlt} className={styles.cardImage} />
          <div className={styles.info}>
            <div className={styles.textInfo}>
              <h2>{venue.name}</h2>
              <p>
                <FaMapPin />
                {`${venue.location.city}, ${venue.location.country}`}
              </p>
            </div>
            <div className={styles.meta}>
              <span className={styles.rating}>
                <FaStar /> {venue.rating}
              </span>
              <span className={styles.price}>${venue.price}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
