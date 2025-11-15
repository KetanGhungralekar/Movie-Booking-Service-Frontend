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
        const res = await fetch(`/movies/${id}`)
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

  // Seat map configuration: rows are letters (A..Z) and columns are integers
  const rowsCount = 12 // change this number to show more/less rows (max 26)
  const seatsPerRow = 14 // number of seats per row
  const maxRows = Math.min(rowsCount, 26)
  const rows = Array.from({ length: maxRows }, (_, i) => String.fromCharCode(65 + i)) // ['A','B',...]

  // Exactly 4 rows are premium at the back (per request)
  const premiumCount = Math.min(4, maxRows)

  // helper to check sold seats (randomized but stable for the session)
  const isSold = (rIndex, sIndex) => {
    // Deterministic pseudo-random so layout looks realistic for the demo
    return (rIndex * 31 + sIndex * 17 + (id ? id.length : 0)) % 7 === 0
  }

  const toggleSeat = (r, seatNum, rIdx, sIdx) => {
    const key = `${r}-${seatNum}`
    if (isSold(rIdx, sIdx)) return
    setSelectedSeats((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]))
  }

  return (
      <div>
      <NavBar />
      <Box sx={{ width: '92%', margin: '30px auto', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%', maxWidth: 1200 }}>
          <Box sx={{ width: '100%', maxWidth: 920 }}>
            <h3 style={{ textAlign: 'left', marginBottom: 6 }}>{movie ? movie.name : 'Select seats'}</h3>
            <p style={{ color: '#666', marginTop: 0, marginBottom: 12 }}>{movie ? movie.type : ''}</p>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ width: '60%', maxWidth: 680, margin: '0 auto', display: 'block', background: '#e9eef7', padding: '12px 0', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
                <strong>Screen</strong>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 16, color: '#999' }}>All eyes this way please</div>


            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
              <div style={{ display: 'grid', gap: 10 }}>
                {rows.map((r, rIdx) => {
                const isPremiumRow = rIdx >= maxRows - premiumCount
                const rowStyle = { display: 'flex', alignItems: 'center', gap: 8 }
                // add extra top gap where premium rows start
                if (isPremiumRow && rIdx === maxRows - premiumCount) rowStyle.marginTop = 18
                return (
                  <div key={r} style={rowStyle}>
                    <div style={{ width: 34, textAlign: 'center', color: '#333', fontWeight: 600 }}>{r}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }} data-row={r}>
                      {Array.from({ length: seatsPerRow }).map((_, sIdx) => {
                        const seatNum = sIdx + 1
                        const sold = isSold(rIdx, sIdx)
                        const key = `${r}-${seatNum}`
                        // integer seat id (unique across layout)
                        const seatId = rIdx * seatsPerRow + sIdx + 1
                        const selected = selectedSeats.includes(key)

                        // styling: premium seats have a subtle different look
                        const baseStyle = {
                          width: 36,
                          height: 28,
                          borderRadius: 6,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          cursor: sold ? 'not-allowed' : 'pointer',
                          color: sold ? '#999' : '#111',
                          userSelect: 'none',
                        }

                        const availableStyle = isPremiumRow
                          ? { background: selected ? '#d6b3ff' : '#f3e8ff', border: '1px solid #caa7ff' }
                          : { background: selected ? '#f6c84c' : '#fff', border: '1px solid #b7e6bd' }

                        const style = Object.assign({}, baseStyle, sold ? { background: '#eee', border: '1px solid #ddd' } : availableStyle)

                        return (
                          <div
                            key={key}
                            id={`seat-${seatId}`}
                            data-seat-id={seatId}
                            style={style}
                            onClick={() => toggleSeat(r, seatNum, rIdx, sIdx)}
                            title={`${r}${seatNum} — id:${seatId}`}
                          >
                            {seatNum}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

            <div style={{ marginTop: 40 , display: 'flex', justifyContent: 'center'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-block', marginRight: 8 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#f6c84c', marginRight: 6, borderRadius: 2 }}></span>
                  Selected (Regular)
                </span>
                <span style={{ display: 'inline-block', marginRight: 8 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#d6b3ff', marginRight: 6, borderRadius: 2 }}></span>
                  Selected (Premium)
                </span>
                <span style={{ display: 'inline-block', marginRight: 8 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#b7e6bd', marginRight: 6, borderRadius: 2 }}></span>
                  Available (Regular)
                </span>
                <span style={{ display: 'inline-block', marginRight: 8 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#f3e8ff', marginRight: 6, borderRadius: 2 }}></span>
                  Available (Premium)
                </span>
                <span style={{ display: 'inline-block' }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ddd', marginRight: 6, borderRadius: 2 }}></span>
                  Sold
                </span>
              </div>
            </div>
          </Box>

          <Box sx={{ width: 260, ml: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', padding: 16, borderRadius: 8, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedSeats.length}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Seats selected</div>
            </div>
            <Button variant="contained" sx={{ backgroundColor: '#f84464', width: '100%' }} disabled={selectedSeats.length === 0} onClick={() => alert(`Proceeding with ${selectedSeats.length} seats`)}>
              Proceed
            </Button>
          </Box>
          </Box>
        </Box>
      {/* </Box> */}
      </div>
  )
}

export default SeatLayout
