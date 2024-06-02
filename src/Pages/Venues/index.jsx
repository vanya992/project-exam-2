import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useFetch } from "../../Hooks/useFetch";
import { Card } from "../../Components/Card";
import styles from "./Venues.module.css";
import { FaPaw, FaUtensils, FaWifi } from "react-icons/fa";
import { FaSquareParking } from "react-icons/fa6";
import { Loader } from "../../Components/Loader";

const amenitiesOptions = [
  { label: "WiFi", value: "wifi", icon: <FaWifi /> },
  { label: "Parking", value: "parking", icon: <FaSquareParking /> },
  { label: "Breakfast", value: "breakfast", icon: <FaUtensils /> },
  { label: "Pets", value: "pets", icon: <FaPaw /> },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Latest", value: "latest" },
];

export const Venues = () => {
  const {
    data,
    isLoading,
    isError: fetchError,
  } = useFetch("https://v2.api.noroff.dev/holidaze/venues?limit=100");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterData();
  }, [data, selectedAmenities, selectedCategory]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prevSelectedAmenities) =>
      prevSelectedAmenities.includes(amenity)
        ? prevSelectedAmenities.filter((a) => a !== amenity)
        : [...prevSelectedAmenities, amenity]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filterData = () => {
    if (!data) return;

    let filtered = [...data];

    if (selectedCategory === "latest") {
      filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((venue) =>
        selectedAmenities.every((amenity) => venue.meta[amenity])
      );
    }

    setFilteredData(filtered);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevState) => !prevState);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || fetchError) {
    console.error("Error fetching data");
    return <div>Error loading page. Check console for more details.</div>;
  }

  return (
    <main className={styles.venuesBg}>
      <Helmet>
        <title>Venues | Holidaze</title>
      </Helmet>
      {loading ? (
        <Loader loading={true} />
      ) : (
        <>
          <h1>Find your dream vacation</h1>
          <div className={styles.filterBox}>
            <button
              className={styles.filterToggle}
              onClick={toggleFilterVisibility}
            >
              Filter Options
            </button>
            <div
              className={`${styles.filterOptions} ${
                isFilterVisible ? styles.show : ""
              }`}
            >
              {categories.map((category) => (
                <div
                  key={category.value}
                  className={`${styles.filterOption} ${
                    selectedCategory === category.value ? styles.active : ""
                  }`}
                  onClick={() => handleCategoryChange(category.value)}
                >
                  {category.label}
                </div>
              ))}
              {amenitiesOptions.map((amenity) => (
                <div
                  key={amenity.value}
                  className={`${styles.filterOption} ${
                    selectedAmenities.includes(amenity.value)
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => handleAmenityChange(amenity.value)}
                >
                  {amenity.icon} {amenity.label}
                </div>
              ))}
            </div>
          </div>
          <section className={styles.venues}>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((venue) => <Card key={venue.id} venue={venue} />)
            ) : (
              <div>No data available.</div>
            )}
          </section>
        </>
      )}
    </main>
  );
};
