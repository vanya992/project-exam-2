import { useState, useEffect, useCallback } from "react";
import {
  format,
  isBefore,
  isSameDay,
  isAfter,
  startOfDay,
  getDaysInMonth,
  addMonths,
  subMonths,
  addDays,
  subDays,
} from "date-fns";
import styles from "./Calendar.module.css";

export const Calendar = ({
  bookings = [],
  onDateChange,
  priceChange,
  maxGuests,
  guests,
  setGuests,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = startOfDay(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoveringDate, setHoveringDate] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      onDateChange(startDate, endDate);
    }
  }, [startDate, endDate]);

  const daysInMonth = Array.from(
    { length: getDaysInMonth(currentDate) },
    (_, i) => {
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i + 1
      );
      return {
        day: i + 1,
        date: startOfDay(dayDate),
      };
    }
  );

  const unavailableDays = bookings.map((booking) => ({
    start: startOfDay(new Date(booking.dateFrom)),
    end: startOfDay(new Date(booking.dateTo)),
  }));

  const isUnavailable = useCallback(
    (date) => {
      if (isBefore(date, today)) return true;
      return unavailableDays.some(
        ({ start, end }) =>
          isAfter(startOfDay(date), subDays(startOfDay(start), 1)) &&
          isBefore(startOfDay(date), addDays(startOfDay(end), 1))
      );
    },
    [today, unavailableDays]
  );

  const selectDate = (date) => {
    if (!isUnavailable(date) && !isBefore(date, today)) {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
        setHoveringDate(null);
      } else if (isAfter(date, startDate)) {
        const isRangeUnavailable = unavailableDays.some(
          ({ start, end }) =>
            isAfter(date, startDate) &&
            isBefore(start, date) &&
            isAfter(end, startDate)
        );

        if (isRangeUnavailable) {
          setStartDate(null);
        } else {
          setEndDate(date);
          setHoveringDate(null);
        }
      }
    }
  };

  const hoverDate = (date) => {
    if (
      startDate &&
      !endDate &&
      isAfter(date, startDate) &&
      !isUnavailable(date)
    ) {
      setHoveringDate(date);
    } else {
      setHoveringDate(null);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleGuestChange = (e) => setGuests(e.target.value);

  return (
    <div>
      <div className={styles.calendarHeader}>
        <button type="button" className={styles.navButton} onClick={prevMonth}>
          &lt;
        </button>
        <span className={styles.currentDate}>
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button type="button" className={styles.navButton} onClick={nextMonth}>
          &gt;
        </button>
      </div>
      <div className={styles.daysGrid}>
        {daysInMonth.map(({ day, date }) => {
          const isPast = isBefore(date, today);
          const isToday = isSameDay(date, today);
          const isSelected =
            (startDate && isSameDay(date, startDate)) ||
            (endDate && isSameDay(date, endDate));
          const isInRange =
            (startDate &&
              hoveringDate &&
              isAfter(date, startDate) &&
              isBefore(date, startOfDay(hoveringDate))) ||
            (startDate &&
              endDate &&
              isAfter(date, startDate) &&
              isBefore(date, endDate));
          const isHovering = hoveringDate && isSameDay(date, hoveringDate);
          const unavailable = isUnavailable(date);

          return (
            <div
              key={day}
              onMouseEnter={() => hoverDate(date)}
              onClick={() => selectDate(date)}
              className={`${styles.day} ${
                isSelected ? styles.selectedDay : ""
              } ${isInRange ? styles.inRangeDay : ""} ${
                isHovering ? styles.hoveringDay : ""
              } ${isToday ? styles.today : ""} ${
                unavailable ? styles.unavailableDay : ""
              } ${isPast ? styles.pastDay : ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className={styles.guests}>
        <label htmlFor="guest-select" className={styles.guestLabel}>
          Guests
        </label>
        <select
          id="guest-select"
          className={styles.guestSelect}
          value={guests}
          onChange={handleGuestChange}
        >
          {[...Array(maxGuests).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      {priceChange ? (
        <div className={styles.totalPrice}>
          <span>Total: </span>
          <span className={styles.priceAmount}>{priceChange}</span>
          <span>,-</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
