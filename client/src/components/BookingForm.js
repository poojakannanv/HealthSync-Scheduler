import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { bookAppointment } from "../services/api";

const BookingForm = () => {
  const [patientId, setPatientId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookAppointment({ patientId, providerId, appointmentTime });
      alert("Appointment booked successfully");
    } catch (error) {
      alert("Failed to book appointment");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Provider ID"
        value={providerId}
        onChange={(e) => setProviderId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Appointment Time"
        type="datetime-local"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Book Appointment
      </Button>
    </Box>
  );
};

export default BookingForm;
