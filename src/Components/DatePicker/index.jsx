import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DatePicker.module.css";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays, isWithinInterval } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAuth } from "../../Auth";

export const VenueDatepicker = ({ bookings, venueId }) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const refOne = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const isDateBooked = (date) => {
    return bookings.some((booking) => {
      return isWithinInterval(date, {
        start: booking.startDate,
        end: booking.endDate,
      });
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to make a booking.");
      navigate("/login");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("You must be logged in to make a booking");
      navigate("/login");
      return;
    }

    const bookingData = {
      dateFrom: range[0].startDate.toISOString(),
      dateTo: range[0].endDate.toISOString(),
      guests,
      venueId,
    };

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const result = await response.json();
      console.log("Booking created", result);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className={styles.calendarWrap}>
      <input
        value={`${format(range[0].startDate, "dd/MM/yyyy")} to ${format(
          range[0].endDate,
          "dd/MM/yyyy"
        )}`}
        readOnly
        className={styles.inputBox}
        onClick={() => {
          setOpen((open) => !open);
        }}
      />
      <div ref={refOne}>
        {open && (
          <DateRange
            onChange={(item) => setRange([item.selection])}
            editableDataInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            disabledDay={(date) => isDateBooked(date)}
            className={styles.calendarElement}
          />
        )}
      </div>
      <form onSubmit={handleBooking} className={styles.bookingForm}>
        <label>
          Guests:
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </label>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};
