
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Generates a JWT token for a user.
 * @param {string} id - User ID.
 * @param {string} role - User role.
 * @returns {string} JWT token
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;
