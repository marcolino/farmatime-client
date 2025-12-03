import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  Container,
  Button
} from '@mui/material';
import { Box, SectionHeader } from '../components/custom';

// Example data: 5 rows x 8 columns
const generateSeatMap = (rows = 5, cols = 8) =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `${row}-${col}`,
      row,
      col,
      reserved: false,
    }))
  );

const TicketTeatherMap = ({ rows = 5, cols = 8, onReserve }) => {
  const { t } = useTranslation();
  const [seats, setSeats] = useState(generateSeatMap(rows, cols));
  const [selected, setSelected] = useState(new Set());

  const toggleSeat = (row, col) => {
    const seat = seats[row][col];
    if (seat.reserved) return;

    const key = `${row}-${col}`;
    const updated = new Set(selected);
    updated.has(key) ? updated.delete(key) : updated.add(key);
    setSelected(updated);
  };

  const handleReserve = () => {
    const updatedSeats = seats.map(row =>
      row.map(seat =>
        selected.has(seat.id) ? { ...seat, reserved: true } : seat
      )
    );
    setSeats(updatedSeats);
    setSelected(new Set());

    if (onReserve) {
      onReserve([...selected]); // returns array of reserved seat ids
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader>
        {t('Teater seats map')}
      </SectionHeader>
      
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box sx={{ border: "1px solid #333", px: 10, py: 1, mb: 5 }}>
          {t("STAGE")}
        </Box>

        <Box style={{ display: "grid", gap: 8 }}>
          {seats.map((row, rowIndex) => (
            <Box key={rowIndex} sx={{ display: "flex", gap: 1 }}>
              {row.map(seat => {
                const isSelected = selected.has(seat.id);
                const seatRow = 1 + seat.row;
                const seatCol = 1 + seat.col;
                let seatName = "";
                if (seatRow >= 1) {
                  if (seatRow <= 26) {
                    // 65 is the char code for 'A'
                    seatName = String.fromCharCode(64 + seatRow) + seatCol;
                  } else {
                    console.error("Seat row greater than 26");
                  }
                } else {
                  console.error("Seat row less than 1");
                }
                return (
                  <Box
                    key={seat.id}
                    onClick={() => toggleSeat(seat.row, seat.col)}
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: seat.reserved
                        ? "#aaa"
                        : isSelected
                          ? "#4caf50"
                          : "#eee",
                      border: "1px solid #333",
                      cursor: seat.reserved ? "not-allowed" : "pointer",
                      textAlign: "center",
                      lineHeight: "30px",
                      fontSize: "12px",
                    }}
                  >
                    {seatName}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleReserve}
          disabled={selected.size === 0}
          sx={{ mt: 5 }}
        >
          {t("Confirm Reservation")}
        </Button>
      </Box>
    </Container>
  );
};

export default React.memo(TicketTeatherMap);