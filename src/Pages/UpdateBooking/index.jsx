import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth";
import { UpdateBookingForm } from "../../Forms/UpdateBookingForm";
import axios from "axios";

export const UpdateBooking = () => {
  const { user } = useAuth();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      const url = `https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`;
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "X-Noroff-Api-Key": apiKey,
        },
      };
      try {
        const response = await axios.get(url, config);
        setBooking(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && bookingId) {
      fetchBooking();
    }
  }, [user, bookingId, apiKey]);

  const handleUpdate = async (id, updatedBookingData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "X-Noroff-Api-Key": apiKey,
      },
    };
    try {
      const response = await axios.put(
        `https://v2.api.noroff.dev/holidaze/bookings/${id}`,
        updatedBookingData,
        config
      );
      if (response.status === 200) {
        alert("Booking updated successfully");
        navigate(`/profile`);
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {booking && (
        <UpdateBookingForm
          booking={booking}
          onUpdate={handleUpdate}
          onClose={() => navigate(`/profile`)}
        />
      )}
    </div>
  );
};
