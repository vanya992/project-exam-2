import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SearchResults.module.css";

export const SearchResults = ({ results, resetInput }) => {
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
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

  return (
    <div ref={refOne}>
      {open && (
        <div className={styles.results}>
          {results.length === 0 ? (
            <div>No venue matches your search. Try again, please!</div>
          ) : (
            results.map((result) => (
              <Link
                key={result.id}
                to={`/venue/${result.id}`}
                className={styles.resultItem}
                onClick={resetInput}
              >
                {result.name}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};
