import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh'; // Import the Refresh icon
import axios from "axios";
import BookAppointment from "./BookAppointment"; // Ensure the path is correct

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false); // State to manage the visibility of the booking form

  const fetchAppointment = async () => {
    try {
      const patientID = localStorage.getItem("userID"); // Assuming you store the patientID in localStorage

      // Make sure patientID exists
      if (!patientID) {
        throw new Error("Patient ID not found in localStorage");
      }

      // Construct the URL with the patientID as a query parameter
      const url = `https://rxchtsxwae.execute-api.eu-west-2.amazonaws.com/prod/appointments/${patientID}`;

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.request(config);

      setAppointments(JSON.parse(response.data.body)); // Parse the JSON string in the response body
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  const handleShowBookingForm = () => {
    setShowBookingForm(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAppointment(); // Call the function to refresh appointments
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" gutterBottom>
          Manage your appointments here
        </Typography>
        <IconButton onClick={handleRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </div>

      <List>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <ListItem key={appointment.appointmentID}>
              <ListItemText
                primary={`Appointment with : ${appointment.providerName}`}
                secondary={`Date: ${appointment.date}, Type: ${appointment.appointmentType}, Status: ${appointment.status}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">
            No appointments found. Please book an appointment.
          </Typography>
        )}
      </List>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handleShowBookingForm}
      >
        Book Appointment
      </Button>

      {showBookingForm && <BookAppointment />}
    </div>
  );
};

export default AppointmentManagement;
