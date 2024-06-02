import React, { useState } from "react";
import styles from "./UpdateBookingForm.module.css";
import { VenueDatepicker } from "../../Components/DatePicker/index";

export const UpdateBookingForm = ({ booking, bookings, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    dateFrom: new Date(booking.dateFrom),
    dateTo: new Date(booking.dateTo),
    guests: booking.guests,
  });

  const handleDateChange = ({ startDate, endDate }) => {
    setFormData((prevData) => ({
      ...prevData,
      dateFrom: startDate,
      dateTo: endDate,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(booking.id, formData);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>Update Booking</h2>
        <form onSubmit={handleSubmit}>
          <label>Date Range:</label>
          <VenueDatepicker
            bookings={bookings}
            onDateChange={handleDateChange}
          />

          <label>Guests:</label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
          />

          <div className={styles.buttons}>
            <button type="submit" className="ctaButton">
              Update Booking
            </button>
            <button type="button" className="ctaButton" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
