import { useState, useEffect } from "react";
import { format, differenceInDays, startOfDay } from "date-fns";
import { Calendar } from "../../Calendar";
import { useAuth } from "../../../Auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Confetti from "react-confetti";
import styles from "./DateRangePicker.module.css";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token during booking:", decoded);
    if (!decoded.exp) {
      console.warn(
        "Token does not have an exp claim. Token validity cannot be ensured."
      );
      return true;
    }
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const DateRangePicker = ({ venue, onBookingSuccess }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [guests, setGuests] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useAuth();

  const toDateString = (date) =>
    date ? format(startOfDay(date), "yyyy-MM-dd") : "";

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      calculateTotalPrice(selectedStartDate, selectedEndDate);
    }
  }, [selectedStartDate, selectedEndDate]);

  const handleDateSelection = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate || startDate);
    calculateTotalPrice(startDate, endDate || startDate);
  };

  const calculateTotalPrice = (startDate, endDate) => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      const price = venue.price * days;
      setPriceChange(price);
    } else {
      setPriceChange(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedStartDate && selectedEndDate) {
      const bookingData = {
        dateFrom: toDateString(selectedStartDate),
        dateTo: toDateString(selectedEndDate),
        guests: parseInt(guests),
        venueId: venue.id,
      };

      console.log("Booking Data:", bookingData);

      if (user && user.token) {
        const tokenValid = isTokenValid(user.token);
        console.log("Token:", user.token);
        console.log("Token Validity:", tokenValid);

        if (tokenValid) {
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
                "X-Noroff-Api-Key": process.env.REACT_APP_API_KEY,
                "Content-Type": "application/json",
              },
            };

            console.log("Config Headers:", config.headers);

            const response = await axios.post(
              "https://v2.api.noroff.dev/holidaze/bookings",
              bookingData,
              config
            );

            console.log("API Response:", response);

            if (response.status === 201) {
              if (onBookingSuccess) {
                onBookingSuccess(response.data);
              }
              setSuccessMessage("Booking successful!");
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
            } else {
              throw new Error("Booking failed.");
            }
          } catch (error) {
            console.error("Error booking venue:", error);
            if (error.response) {
              console.error("Error response data:", error.response.data);
              console.error("Error response status:", error.response.status);
              console.error("Error response headers:", error.response.headers);
            } else if (error.request) {
              console.error("Error request data:", error.request);
            } else {
              console.error("Error message:", error.message);
            }
            alert("There was an error booking the venue.");
          }
        } else {
          alert("Token has expired. Please log in again.");
        }
      } else {
        alert("User is not authenticated.");
      }
    } else {
      alert("Please select valid start and end dates.");
    }
  };

  return (
    <div className={styles.dateRangePicker}>
      {showConfetti && <Confetti />}
      <div className={styles.selectedDates}>
        {selectedStartDate ? (
          <div>
            <span className={styles.days}>
              {differenceInDays(
                selectedEndDate || selectedStartDate,
                selectedStartDate
              ) + 1}{" "}
              days
            </span>
            <div>
              <span>{format(selectedStartDate, "d. MMMM")}</span>
              <span className={styles.dateSeparator}>-</span>
              <span>
                {format(selectedEndDate || selectedStartDate, "d. MMMM")}
              </span>
            </div>
          </div>
        ) : (
          <span className={styles.prompt}>Choose your dates</span>
        )}
      </div>
      <Calendar
        bookings={venue.bookings || []}
        onDateChange={handleDateSelection}
        priceChange={priceChange}
        maxGuests={venue.maxGuests}
        guests={guests}
        setGuests={setGuests}
      />
      <div className={styles.actions}>
        <button
          type="submit"
          className="ctaButton"
          onClick={handleSubmit}
          disabled={!selectedStartDate || !selectedEndDate}
        >
          Book venue
        </button>
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
      </div>
    </div>
  );
};
