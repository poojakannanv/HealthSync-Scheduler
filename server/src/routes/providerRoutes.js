
const express = require('express');
const { body } = require('express-validator');
const {
    registerProvider,
    getProviderProfile,
    updateProviderProfile,
    deleteProviderProfile,
   
    
} = require('../controllers/providerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/provider/register
// @desc    Register a new Provider (Admin only)
router.post(
    '/register',
    authMiddleware,
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('email').custom(value => {
            if (!value.endsWith('@healthsync.com')) {
                throw new Error('Email must end with @healthsync.com');
            }
            return true;
        }),
    ],
    registerProvider
);

// @route   GET /api/provider/:id
// @desc    Get Provider profile (Provider can only view their own data)
router.get('/:id', authMiddleware, getProviderProfile);

// @route   PUT /api/provider/:id
// @desc    Update Provider profile (Provider can only update their own data)
router.put('/:id', authMiddleware, updateProviderProfile);

// @route   DELETE /api/provider/:id
// @desc    Delete Provider profile (Admin only)
router.delete('/:id', authMiddleware, deleteProviderProfile);



module.exports = router;
