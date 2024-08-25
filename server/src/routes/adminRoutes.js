
const express = require('express');
const { body } = require('express-validator');
const { registerAdmin, getAdminProfile, updateAdminProfile, deleteAdminProfile } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/admin/register
// @desc    Register a new Admin
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    registerAdmin
);

// @route   GET /api/admin/:id
// @desc    Get Admin profile
router.get('/:id', authMiddleware, getAdminProfile);

// @route   PUT /api/admin/:id
// @desc    Update Admin profile
router.put('/:id', authMiddleware, updateAdminProfile);

// @route   DELETE /api/admin/:id
// @desc    Delete Admin profile
router.delete('/:id', authMiddleware, deleteAdminProfile);

module.exports = router;
