import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../../Assets/images/holi-2.png";
import styles from "./Header.module.css";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { SearchBar } from "../../Search";
import { SearchResults } from "../../SearchResults";
import { useAuth } from "../../../Auth";

export const Header = () => {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");
  const { user, logout } = useAuth();

  const resetInput = () => {
    setInput("");
  };

  const [isNavVisible, setIsNavVisible] = useState(false);

  const navRef = useRef();

  const showNavbar = () => {
    setIsNavVisible((prevVisible) => !prevVisible);
    navRef.current.classList.toggle(styles.responsiveNav);
  };

  const closeMenu = () => {
    setIsNavVisible(false);
  };

  return (
    <header>
      <Link to="/">
        <img src={logo} alt="logo" className={styles.logo} />
      </Link>
      <SearchBar setResults={setResults} input={input} setInput={setInput} />
      {results.length > 0 && (
        <SearchResults results={results} resetInput={resetInput} />
      )}
      <nav
        className={`${styles.nav} ${isNavVisible ? styles.responsiveNav : ""}`}
        ref={navRef}
      >
        <button className={styles.close} onClick={showNavbar}>
          <FaTimes />
        </button>
        <ul>
          <li>
            <Link to="/venues" onClick={closeMenu}>
              Venues
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/createVenue" onClick={closeMenu}>
                  Create venue
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={closeMenu}>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="ctaButton"
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={closeMenu} className="ctaButton">
                Sign In <FaUser />
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <button className={styles.burger} onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
};
