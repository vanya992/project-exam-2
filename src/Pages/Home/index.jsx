import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import {
  FaAngleRight,
  FaDollarSign,
  FaHandPointer,
  FaPaw,
} from "react-icons/fa";

export const Home = () => {
  return (
    <main>
      <Helmet>
        <title>Home | Holidaze</title>
      </Helmet>
      <div className={styles.bgImg}>
        <div className={styles.banner}>
          <h1>Find your perfect acommodation with Holidaze</h1>
          <p>Discover a vide range of accommodations for your next trip.</p>
          <Link to="/venues">
            <button className="ctaButton">Book now</button>
          </Link>
        </div>
      </div>
      <section className={styles.infoLayout}>
        <div>
          <div>
            <FaHandPointer className={styles.icon} />
          </div>
          <h3>Top Amenities and Location</h3>
          <p>
            Enjoy free Wi-Fi, parking, and breakfast options, with central
            locations.
          </p>
          <Link to="/venues">
            <button className="ctaButton">
              Book now <FaAngleRight />
            </button>
          </Link>
        </div>
        <div>
          <div>
            <FaDollarSign className={styles.icon} />
          </div>
          <h3>Affordable prices</h3>
          <p>
            We guarantee you will find your dream vacation that fits your
            budget.
          </p>
          <Link to="/venues">
            <button className="ctaButton">
              Book now <FaAngleRight />
            </button>
          </Link>
        </div>
        <div>
          <div>
            <FaPaw className={styles.icon} />
          </div>
          <h3>Pet Friendly options</h3>
          <p>We welcome your furry friends with open arms.</p>
          <Link to="/venues">
            <button className="ctaButton">
              Book now <FaAngleRight />
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};
