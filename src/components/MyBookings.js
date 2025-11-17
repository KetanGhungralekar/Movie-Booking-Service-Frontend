import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import NavBar from "./NavBar";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await fetch("/bookings/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error("ERROR FETCHING BOOKINGS", err);
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "30px" }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
        >
          My Bookings
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : bookings.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "#666", mt: 5 }}>
            No bookings found.
          </Typography>
        ) : (
          <Box sx={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 3 }}>
            {bookings.map((b) => (
              <Paper
                key={b.id}
                sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Booking #{b.id}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      <strong>Status:</strong> {b.status}
                    </Typography>
                    <Typography>
                      <strong>Total:</strong> ₹{b.totalAmount}
                    </Typography>
                    {b.paymentId && (
                      <Typography>
                        <strong>Payment ID:</strong> {b.paymentId}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography>
                      <strong>Show ID:</strong> {b.showId}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      <strong>Seats:</strong>
                    </Typography>
                    <Box>
                      {b.seats?.map((s, idx) => (
                        <Typography key={idx} sx={{ fontSize: 14 }}>
                          Seat {s.seatNumber} — ₹{s.price}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ textAlign: "right", mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#f84464" }}
                    onClick={() => navigate(`/bookmyshow/movies`)}
                  >
                    Book Again
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}