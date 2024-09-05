import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import api from "../../services/api"; // Import the configured Axios instance

const CreateProvider = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    DOB: "",
    gender: "",
    personalEmail: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    consultationFee: "",
    availability: [
      { date: "", timeSlots: [] },
      { date: "", timeSlots: [] },
    ],
    availabilityStatus: "Available",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...formData.availability];
    if (field === "date") {
      updatedAvailability[index].date = value;
    } else {
      updatedAvailability[index].timeSlots = value.split(",");
    }
    setFormData((prevData) => ({ ...prevData, availability: updatedAvailability }));
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
    if (!formData.specialization) formErrors.specialization = "Specialization is required";
    if (!formData.licenseNumber) formErrors.licenseNumber = "License number is required";
    if (!formData.consultationFee) formErrors.consultationFee = "Consultation fee is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = {
          ...formData,
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        };
       
        const response = await api.post("/provider/register", data);
        setSuccessMessage("Provider registered successfully!");
        console.log("Provider registered successfully:", response.data);
        // Optionally, you could redirect or clear the form here
      } catch (error) {
        console.error("Error registering provider:", error);
        setErrors({ apiError: "Failed to register provider" });
      }
    }
  };

  return (
    <Container maxWidth="sm">
            <Typography variant="h4" className="form-title">
              Register Provider
            </Typography>
            {successMessage && (
              <Typography variant="body1" color="success">
                {successMessage}
              </Typography>
            )}
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
                    label="Personal Email"
                    name="personalEmail"
                    type="email"
                    fullWidth
                    value={formData.personalEmail}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Specialization"
                    name="specialization"
                    fullWidth
                    value={formData.specialization}
                    onChange={handleChange}
                    error={!!errors.specialization}
                    helperText={errors.specialization}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="License Number"
                    name="licenseNumber"
                    fullWidth
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Years of Experience"
                    name="yearsOfExperience"
                    fullWidth
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Consultation Fee"
                    name="consultationFee"
                    fullWidth
                    value={formData.consultationFee}
                    onChange={handleChange}
                    error={!!errors.consultationFee}
                    helperText={errors.consultationFee}
                  />
                </Grid>
                {formData.availability.map((availability, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6}>
                      <TextField
                        label={`Availability Date ${index + 1}`}
                        name={`availabilityDate${index}`}
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={availability.date}
                        onChange={(e) =>
                          handleAvailabilityChange(index, "date", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label={`Time Slots ${index + 1} (comma-separated)`}
                        name={`timeSlots${index}`}
                        fullWidth
                        value={availability.timeSlots.join(",")}
                        onChange={(e) =>
                          handleAvailabilityChange(index, "timeSlots", e.target.value)
                        }
                      />
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  <TextField
                    label="Availability Status"
                    name="availabilityStatus"
                    fullWidth
                    value={formData.availabilityStatus}
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
                    Register Provider
                  </Button>
                </Grid>
                {errors.apiError && (
                  <Grid item xs={12}>
                    <Typography color="error">{errors.apiError}</Typography>
                  </Grid>
                )}
              </Grid>
            </form>
    </Container>
  );
};

export default CreateProvider;
