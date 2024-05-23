import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SearchResults.module.css";

export const SearchResults = ({ results }) => {
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  const hideOnClickOutside = (e) => {
    console.log("Event fired");
    if (refOne.current && !refOne.current.contains(e.target)) {
      console.log("Click outside");
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);

    return () => {
      document.removeEventListener("click", hideOnClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (results && results.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [results]);

  if (!results || results.length === 0) {
    return <div> No venue matches your search. Try again, please!</div>;
  }

  console.log("Dropdown open state:", open);

  return (
    <div ref={refOne}>
      {open && (
        <div
          className={styles.results}
          onClick={() => {
            setOpen((open) => !open);
          }}
        >
          {results.map((result) => (
            <Link
              key={result.id}
              to={`/venue/${result.id}`}
              className={styles.resultItem}
            >
              {result.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
