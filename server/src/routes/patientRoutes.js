
const express = require('express');
const { body } = require('express-validator');
const {
    registerPatient,
    getPatientProfile,
    updatePatientProfile,
    deletePatientProfile,
} = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/patient/register
// @desc    Register a new Patient
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    registerPatient
);

// @route   GET /api/patient/:id
// @desc    Get Patient profile (Patient can view their own data, Provider and Admin can view all patients)
router.get('/:id', authMiddleware, getPatientProfile);

// @route   PUT /api/patient/:id
// @desc    Update Patient profile (Patient can update their own data, Admin can update all patients)
router.put('/:id', authMiddleware, updatePatientProfile);

// @route   DELETE /api/patient/:id
// @desc    Delete Patient profile (Admin only)
router.delete('/:id', authMiddleware, deletePatientProfile);




module.exports = router;
