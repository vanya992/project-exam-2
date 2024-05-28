// src/Components/DatePicker/DateRangePicker.jsx
import React, { useState, useEffect } from "react";
import { format, differenceInDays, startOfDay } from "date-fns";
import { Calendar } from "../../Calendar";
import { useAuth } from "../../../Auth";
import axios from "axios";
import styles from "./DateRangePicker.module.css";

export const DateRangePicker = ({ venue, onBookingSuccess }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [guests, setGuests] = useState(1);
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
    setSelectedEndDate(endDate);
    calculateTotalPrice(startDate, endDate);
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
        guests: guests,
        venueId: venue.id,
      };
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.post(
          "https://v2.api.noroff.dev/holidaze/bookings",
          bookingData,
          config
        );
        if (response.status === 201) {
          if (onBookingSuccess) {
            onBookingSuccess(response.data);
          }
        } else {
          throw new Error("Booking failed.");
        }
      } catch (error) {
        console.log("Error booking venue:", error);
        alert("There was an error booking the venue.");
      }
    } else {
      console.log("error");
    }
  };

  return (
    <div className={styles.dateRangePicker}>
      <div className={styles.selectedDates}>
        {selectedStartDate ? (
          selectedEndDate ? (
            <div>
              <span className={styles.days}>
                {differenceInDays(selectedEndDate, selectedStartDate) + 1} days
              </span>
              <div>
                <span>{format(selectedStartDate, "d. MMMM")}</span>
                <span className={styles.dateSeparator}>-</span>
                <span>{format(selectedEndDate, "d. MMMM")}</span>
              </div>
            </div>
          ) : (
            <div>
              <span>{format(selectedStartDate, "d. MMMM")}</span>
              <span className={styles.dateSeparator}>-</span>
            </div>
          )
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
      <button
        type="submit"
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={!selectedStartDate || !selectedEndDate}
      >
        Book venue
      </button>
    </div>
  );
};
