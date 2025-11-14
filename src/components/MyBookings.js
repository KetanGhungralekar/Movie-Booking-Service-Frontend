import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import NavBar from './NavBar'

function MyBookings() {
  const location = useLocation()
  // If navigated here after booking, bookingDetail may be passed in location.state
  const bookingDetail = location?.state?.booking || null
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    // try fetch user's bookings from backend endpoint if Authorization token exists
    const token = localStorage.getItem('Authorization')
    if (!token) return
    const fetchBookings = async () => {
      try {
        const res = await fetch('https://book-my-show-backend-arasuramanan.onrender.com/users/bookings', {
          headers: { Authorization: token },
        })
        if (!res.ok) return
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          const data = await res.json()
          setBookings(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.warn('Could not load bookings', err)
      }
    }
    fetchBookings()
  }, [])

  return (
    <>
      <NavBar />
      <Box sx={{ width: '80%', margin: '20px auto' }}>
        <h2>My Bookings</h2>

        {/* If we have an immediate booking detail to show (receipt) show it first */}
        {bookingDetail && (
          <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <h3>Booking Confirmation</h3>
            <p>
              <strong>Movie:</strong> {bookingDetail.movieName}
            </p>
            <p>
              <strong>Theater:</strong> {bookingDetail.theaterName}
            </p>
            <p>
              <strong>Show:</strong> {bookingDetail.showTime}
            </p>
            <p>
              <strong>Seats:</strong> {bookingDetail.seats?.join(', ')}
            </p>
            <p>
              <strong>Total:</strong> ₹ {bookingDetail.total}
            </p>
            <p>
              <strong>Booking ID:</strong> {bookingDetail.bookingId}
            </p>
          </Paper>
        )}

        <div>
          <h3>All Bookings</h3>
          {bookings.length === 0 && <p>No bookings found.</p>}
          {bookings.map((b, idx) => (
            <Paper sx={{ padding: 2, marginBottom: 2 }} key={idx}>
              <p>
                <strong>Movie:</strong> {b.movieName || b.movie || ''}
              </p>
              <p>
                <strong>Theater:</strong> {b.theaterName || b.theater || ''}
              </p>
              <p>
                <strong>Show:</strong> {b.showTime || b.show || ''}
              </p>
              <p>
                <strong>Seats:</strong> {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}
              </p>
              <p>
                <strong>Total:</strong> ₹ {b.total}
              </p>
              <p>
                <strong>Booking ID:</strong> {b.bookingId || b._id || ''}
              </p>
            </Paper>
          ))}
        </div>
      </Box>
    </>
  )
}

export default MyBookings
