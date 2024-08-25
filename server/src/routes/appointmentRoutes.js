
const express = require('express');
const { bookAppointment, getAppointmentDetails } = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/appointment/book
// @desc    Book a new Appointment (Patient only)
router.post('/book', authMiddleware, bookAppointment);

// @route   GET /api/appointment/:id
// @desc    Get Appointment details (Patient, Provider, or Admin)
router.get('/:id', authMiddleware, getAppointmentDetails);

module.exports = router;
