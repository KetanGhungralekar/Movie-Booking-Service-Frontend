import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import NavBar from './NavBar'

// Simple seat layout mock similar to BookMyShow
function SeatLayout() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  // minimal robust fetch for movie info (optional)
  useEffect(() => {
    let mounted = true
    const getMovie = async () => {
      try {
        const res = await fetch(`https://book-my-show-backend-arasuramanan.onrender.com/bookmyshow/movies/${id}`, {
          method: 'GET',
          headers: { Authorization: localStorage.getItem('Authorization') },
        })
        if (!res.ok) return
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await res.json()
          if (mounted) setMovie(data)
        }
      } catch (err) {
        console.warn('Could not load movie for seat layout', err)
      }
    }
    getMovie()
    return () => (mounted = false)
  }, [id])

  // Generate a sample seat map: rows G..P (8 rows) with 13 seats each
  const rows = ['P','O','N','M','L','K','J','H','G']
  const seatsPerRow = 13

  // helper to check sold seats (randomized but stable for the session)
  const isSold = (rIndex, sIndex) => {
    // simple deterministic pseudo-random so layout looks realistic
    return (rIndex * 31 + sIndex * 17 + id.length) % 7 === 0
  }

  const toggleSeat = (r, s) => {
    const key = `${r}-${s}`
    if (isSold(rows.indexOf(r), s)) return
    setSelectedSeats((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]))
  }

  return (
    <>
      <NavBar />
      <Box sx={{ width: '80%', margin: '20px auto' }}>
        <h3>{movie ? movie.name : 'Select seats'} </h3>
        <p style={{ color: '#666' }}>{movie ? movie.type : ''}</p>

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ display: 'inline-block', background: '#e9eef7', padding: '12px 40px', borderRadius: 6 }}>
                <strong>Screen</strong>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 16, color: '#999' }}>All eyes this way please</div>

            <div style={{ display: 'grid', gap: 10 }}>
              {rows.map((r, rIdx) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, textAlign: 'center', color: '#333' }}>{r}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {Array.from({ length: seatsPerRow }).map((_, sIdx) => {
                      const seatNum = seatsPerRow - sIdx
                      const sold = isSold(rIdx, sIdx)
                      const key = `${r}-${seatNum}`
                      const selected = selectedSeats.includes(key)
                      const style = {
                        width: 36,
                        height: 28,
                        borderRadius: 6,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        cursor: sold ? 'not-allowed' : 'pointer',
                        background: sold ? '#ddd' : selected ? '#f6c84c' : '#fff',
                        border: sold ? '1px solid #ccc' : '1px solid #b7e6bd',
                        color: sold ? '#999' : '#333',
                      }
                      return (
                        <div key={key} style={style} onClick={() => toggleSeat(r, seatNum)}>
                          {seatNum}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'inline-block', marginRight: 8 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#f6c84c', marginRight: 6, borderRadius: 2 }}></span>
                  Selected
                </span>
                <span style={{ display: 'inline-block', marginRight: 8 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#b7e6bd', marginRight: 6, borderRadius: 2 }}></span>
                  Available
                </span>
                <span style={{ display: 'inline-block' }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ddd', marginRight: 6, borderRadius: 2 }}></span>
                  Sold
                </span>
              </div>
              <div>
                <strong>{selectedSeats.length} seats</strong>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <Button variant="contained" sx={{ backgroundColor: '#f84464' }} disabled={selectedSeats.length === 0} onClick={() => alert(`Proceeding with ${selectedSeats.length} seats`)}>
                Proceed
              </Button>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default SeatLayout
