import React, { useState, useEffect } from "react";
import styles from "./Search.module.css";
import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ setResults, input, setInput }) => {
  const [allData, setAllData] = useState([]);

  const fetchData = async (page = 1, accumulatedData = []) => {
    const limit = 100;
    const url = `https://v2.api.noroff.dev/holidaze/venues?limit=${limit}&page=${page}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      const newData = accumulatedData.concat(json.data);

      if (json.data.length < limit) {
        setAllData(newData);
      } else {
        fetchData(page + 1, newData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (value) => {
    setInput(value);
    const results = allData.filter((dataItem) => {
      return (
        dataItem &&
        dataItem.name &&
        dataItem.name.toLowerCase().includes(value.toLowerCase())
      );
    });
    setResults(results);
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
