
const bcrypt = require('bcryptjs');
const dynamoDB = require('../config/dbConfig');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Login a user (Admin, Provider, or Patient)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user;
        let role;
        let userID;

        // Check if the user is an Admin
        let params = {
            TableName: 'Admin',
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        const admin = await dynamoDB.query(params).promise();

        if (admin.Count > 0) {
            user = admin.Items[0];
            role = 'ADMIN';
            userID = user.adminID;
        } else {
            // Check if the user is a Provider
            params = {
                TableName: 'Provider',
                IndexName: 'email-index',
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email,
                },
            };

            const provider = await dynamoDB.query(params).promise();

            if (provider.Count > 0) {
                user = provider.Items[0];
                role = 'PROVIDER';
                userID = user.providerID;
            } else {
                // Check if the user is a Patient
                params = {
                    TableName: 'Patient',
                    IndexName: 'email-index',
                    KeyConditionExpression: 'email = :email',
                    ExpressionAttributeValues: {
                        ':email': email,
                    },
                };

                const patient = await dynamoDB.query(params).promise();

                if (patient.Count > 0) {
                    user = patient.Items[0];
                    role = 'PATIENT';
                    userID = user.patientID;
                } else {
                    return res.status(400).json({ message: 'Invalid email or password' });
                }
            }
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(userID, role);

        // Return user data and token
        res.json({
            message: 'Login successful',
            userID,
            role,
            token,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginUser,
};
