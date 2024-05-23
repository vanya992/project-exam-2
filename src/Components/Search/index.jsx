import React, { useState } from "react";
import styles from "./Search.module.css";
import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ setResults, input, setInput }) => {
  const fetchData = (value) => {
    const url = "https://v2.api.noroff.dev/holidaze/venues";
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        const results = Array.isArray(json.data)
          ? json.data.filter((dataItem) => {
              return (
                dataItem &&
                dataItem.name &&
                dataItem.name.toLowerCase().includes(value.toLowerCase())
              );
            })
          : [];

        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className={styles.searchSection}>
      <input
        type="text"
        placeholder="Search"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      <FaSearch />
    </div>
  );
};
