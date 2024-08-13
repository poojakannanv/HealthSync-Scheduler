import React from "react";
import BookingForm from "../components/BookingForm";
import AppointmentList from "../components/AppointmentList";
import { Container, Typography, Box } from "@mui/material";

const Home = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Healthcare Booking System
      </Typography>
      <Box sx={{ mb: 4 }}>
        <BookingForm />
      </Box>
      <Box>
        <AppointmentList />
      </Box>
    </Container>
  );
};

export default Home;
