import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,

} from "@mui/material";

const PatientManagement = () => {
  const patientData = {
    name: "Jane Smith",
    email: "poojakannanv98@gmail.com",
    phoneNumber: "+918553899438",
    address: {
      street: "456 Wellness Ave.",
      city: "Liverpool",
      postalCode: "L2 2QP",
      country: "UK",
    },
    DOB: "1990-07-22",
    gender: "Female",
    medicalHistory: "Hypertension",
    currentMedication: "Amlodipine",
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Patient Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Name:</strong> {patientData.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Email:</strong> {patientData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {patientData.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Date of Birth:</strong> {patientData.DOB}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Gender:</strong> {patientData.gender}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Address:</strong> {`${patientData.address.street}, ${patientData.address.city}, ${patientData.address.postalCode}, ${patientData.address.country}`}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary">
              Edit Patient Information
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Medical History
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {patientData.medicalHistory}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary">
              Update Medical History
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Medication
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {patientData.currentMedication}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary">
              Update Medication
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientManagement;
