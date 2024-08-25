
const express = require('express');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const providerRoutes = require('./routes/providerRoutes');
const patientRoutes = require('./routes/patientRoutes');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Admin Routes
app.use('/api/admin', adminRoutes);

// Provider Routes
app.use('/api/provider', providerRoutes);

// Patient Routes
app.use('/api/patient', patientRoutes);

// Authentication Routes
app.use('/api/auth', authRoutes);

// Appointment Routes
app.use('/api/appointment', appointmentRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
