import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Box } from "@mui/material";
import { getAppointments } from "../services/api";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        setAppointments(response.data);
      } catch (error) {
        alert("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <List>
        {appointments.map((appointment) => (
          <ListItem key={appointment.id}>
            <ListItemText
              primary={`Patient ID: ${appointment.patientId}, Provider ID: ${appointment.providerId}`}
              secondary={`Appointment Time: ${new Date(
                appointment.appointmentTime
              ).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AppointmentList;
