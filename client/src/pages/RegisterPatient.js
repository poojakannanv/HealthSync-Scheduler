import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import Header from "../components/landing/Header";

const RegisterPatient = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "PATIENT",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    DOB: "",
    gender: "",
    medicalHistory: "",
    currentMedication: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Email is invalid";
    if (!formData.password) formErrors.password = "Password is required";
    else if (formData.password.length < 8)
      formErrors.password = "Password must be at least 8 characters";
    if (!formData.phoneNumber)
      formErrors.phoneNumber = "Phone number is required";
    if (!formData.street) formErrors.street = "Street is required";
    if (!formData.city) formErrors.city = "City is required";
    if (!formData.postalCode) formErrors.postalCode = "Postal code is required";
    if (!formData.country) formErrors.country = "Country is required";
    if (!formData.DOB) formErrors.DOB = "Date of birth is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await register({
          ...formData,
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        });
        console.log("Patient registered successfully");
        // Redirect or show a success message
        navigate("/dashboard"); // Redirect to the dashboard after successful login
      } catch (error) {
        console.error("Error registering patient:", error);
      }
    }
  };

  // If the user is already logged in, redirect to the dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <Header />
      <Container maxWidth="sm" style={{marginTop:"20px"}}>
      <Paper elevation={3} className="form-paper">
        <Card>
          <CardContent>
            <Typography variant="h4" className="form-title" align="center">
              Register Now
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Street"
                    name="street"
                    fullWidth
                    value={formData.street}
                    onChange={handleChange}
                    error={!!errors.street}
                    helperText={errors.street}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="City"
                    name="city"
                    fullWidth
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Postal Code"
                    name="postalCode"
                    fullWidth
                    value={formData.postalCode}
                    onChange={handleChange}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Country"
                    name="country"
                    fullWidth
                    value={formData.country}
                    onChange={handleChange}
                    error={!!errors.country}
                    helperText={errors.country}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Date of Birth"
                    name="DOB"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.DOB}
                    onChange={handleChange}
                    error={!!errors.DOB}
                    helperText={errors.DOB}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Gender"
                    name="gender"
                    fullWidth
                    value={formData.gender}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Medical History"
                    name="medicalHistory"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.medicalHistory}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Current Medication"
                    name="currentMedication"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.currentMedication}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item xs={12} align="center">
                  <Typography variant="body2">
                    Already have an account? <Link to="/login">Login here</Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Paper>
    </Container>
    </div>
    
  );
};

export default RegisterPatient;
