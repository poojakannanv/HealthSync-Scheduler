import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';

const BookAppointment = () => {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await axios.get('/api/providers', {
        params: { specialization }
      });
      setProviders(response.data.providers);
    };

    if (specialization) {
      fetchProviders();
    }
  }, [specialization]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const patientID = localStorage.getItem('userID');

      if (!patientID) {
        throw new Error('Patient ID not found in localStorage');
      }

      let data = JSON.stringify({
        body: JSON.stringify({
          patientID: patientID,
          preferredDate: preferredDate,
          preferredTime: preferredTime,
          appointmentType: appointmentType,
          specialization: specialization,
          providerID: selectedProvider ? selectedProvider.providerID : null,
        }),
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://zmpn7aru98.execute-api.eu-west-2.amazonaws.com/Prod/book-appointment',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios.request(config);

      setMessage('Appointment booked successfully!');
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage('Failed to book the appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ marginTop: '20px', padding: '20px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Book an Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <TextField
              label="Preferred Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <TextField
              label="Preferred Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
            <Select
              labelId="appointment-type-label"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              required
            >
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="in-person">In-Person</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <InputLabel id="specialization-label">Specialization</InputLabel>
            <Select
              labelId="specialization-label"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            >
              <MenuItem value="Cardiology">Cardiology</MenuItem>
              <MenuItem value="Dermatology">Dermatology</MenuItem>
              <MenuItem value="General Practice">General Practice</MenuItem>
              {/* Add more specializations as needed */}
            </Select>
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <Autocomplete
              options={providers}
              getOptionLabel={(option) => `${option.name} (${option.distance} km away)`}
              onChange={(event, newValue) => setSelectedProvider(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Provider"
                  placeholder="Select provider based on location"
                />
              )}
            />
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={10} /> : 'Submit'}
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color="textSecondary" style={{ marginTop: '15px' }}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BookAppointment;
