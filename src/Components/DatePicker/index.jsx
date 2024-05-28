import React, { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./DatePicker.module.css";

export const VenueDatepicker = ({ bookings, onDateChange }) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
    return () => {
      document.removeEventListener("keydown", hideOnEscape, true);
      document.removeEventListener("click", hideOnClickOutside, true);
    };
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

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    onDateChange(ranges.selection);
  };

  const highlightDates = (date) => {
    for (let booking of bookings) {
      const startDate = new Date(booking.dateFrom);
      const endDate = new Date(booking.dateTo);
      if (date >= startDate && date <= endDate) {
        return { style: { backgroundColor: "#ffcccc" } }; // Booked dates in red
      }
    }
    return { style: { backgroundColor: "#ccffcc" } }; // Available dates in green
  };

  return (
    <div className={styles.datepickerContainer} ref={refOne}>
      <input
        value={`${format(range[0].startDate, "dd/MM/yyyy")} to ${format(
          range[0].endDate,
          "MM/dd/yyyy"
        )}`}
        readOnly
        className={styles.datepickerInput}
        onClick={() => setOpen((open) => !open)}
      />
      {open && (
        <DateRange
          editableDateInputs={true}
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          ranges={range}
          minDate={new Date()}
          rangeColors={["#3ecf8e"]}
          dateDisplayFormat="dd-MM-yyyy"
          renderDayContents={(day) => (
            <div {...highlightDates(day)}>{format(day, "d")}</div>
          )}
        />
      )}
    </div>
  );
};
