import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import api from "../../services/api"; 

const ProfileManagement = () => {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
       
        const providerID = localStorage.getItem("userID");

        const response = await api.get(`/provider/${providerID}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile Management
      </Typography>
      {profile ? (
        <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Avatar
                  sx={{ width: 120, height: 120 }}
                  alt={profile.name}
                  src={profile.profileImage || "/static/images/avatar/1.jpg"} // Replace with actual profile image if available
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {profile.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {profile.phoneNumber}
                </Typography>
                <Typography variant="body1">
                  <strong>Specialization:</strong> {profile.specialization}
                </Typography>
                <Typography variant="body1">
                  <strong>Experience:</strong> {profile.yearsOfExperience} years
                </Typography>
                <Typography variant="body1">
                  <strong>Consultation Fee:</strong> ${profile.consultationFee}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {profile.address.street},{" "}
                  {profile.address.city}, {profile.address.postalCode},{" "}
                  {profile.address.country}
                </Typography>
                <Typography variant="body1">
                  <strong>Availability Status:</strong>{" "}
                  {profile.availabilityStatus}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" color="textSecondary">
          No profile data available.
        </Typography>
      )}
    </Box>
  );
};

export default ProfileManagement;
