const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique UUID.
 * @returns {string} UUID string
 */
const generateUUID = () => {
    return uuidv4();
};

module.exports = generateUUID;
