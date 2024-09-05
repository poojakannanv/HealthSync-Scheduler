
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const dynamoDB = require('../config/dbConfig');
const generateUUID = require('../utils/generateUUID');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new Provider (Admin only)
 * @route   POST /api/provider/register
 * @access  Private/Admin
 */
const registerProvider = async (req, res, next) => {
    // Ensure only admin can create providers
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        name,
        email,
        password,
        phoneNumber,
        address,
        DOB,
        gender,
        personalEmail,
        specialization,
        licenseNumber,
        yearsOfExperience,
        consultationFee,
        availability,
        availabilityStatus,
    } = req.body;

    const role = 'PROVIDER'; // Ensure role is set here


    // Ensure provider email ends with '@healthsync.com'
    if (!email.endsWith('@healthsync.com')) {
        return res.status(400).json({ message: 'Email must end with @healthsync.com' });
    }

    try {
        // Check if the provider email already exists
        const params = {
            TableName: 'Provider',
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        const existingProvider = await dynamoDB.query(params).promise();

        if (existingProvider.Count > 0) {
            return res.status(400).json({ message: 'Provider with this email already exists' });
        }

        // Generate a unique UUID for the providerID
        const providerID = generateUUID();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the provider record with the correct schema
        const newProvider = {
            providerID,
            name,
            email,
            password: hashedPassword,
            role: 'PROVIDER',
            phoneNumber,
            address,
            DOB,
            gender,
            personalEmail,
            specialization,
            licenseNumber,
            yearsOfExperience,
            consultationFee,
            availability,
            availabilityStatus,
        };

        const putParams = {
            TableName: 'Provider',
            Item: newProvider,
        };

        // Insert the new provider record into the DynamoDB table
        await dynamoDB.put(putParams).promise();

        // Generate JWT token
        const token = generateToken(providerID, 'PROVIDER');

        // Send response with providerID, message, and token
        res.status(201).json({
            message: 'Provider registered successfully',
            providerID,
            role,
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Provider profile by ID (Provider can only view their own data)
 * @route   GET /api/provider/:id
 * @access  Private/Provider
 */
const getProviderProfile = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Providers can only view their own data
        if (req.user.role !== 'ADMIN' && req.user.id !== id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const params = {
            TableName: 'Provider',
            Key: {
                providerID: id,
            },
        };

        const provider = await dynamoDB.get(params).promise();

        if (!provider.Item) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.json(provider.Item);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Provider profile (Provider can only update their own data)
 * @route   PUT /api/provider/:id
 * @access  Private/Provider
 */
const updateProviderProfile = async (req, res, next) => {
    const { id } = req.params;
    const {
        name,
        phoneNumber,
        address,
        DOB,
        gender,
        personalEmail,
        specialization,
        licenseNumber,
        yearsOfExperience,
        consultationFee,
        availability,
        availabilityStatus,
    } = req.body;

    try {
        // Providers can only update their own data
        if (req.user.role !== 'ADMIN' && req.user.id !== id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if the provider exists
        const getParams = {
            TableName: 'Provider',
            Key: {
                providerID: id,
            },
        };

        const provider = await dynamoDB.get(getParams).promise();

        if (!provider.Item) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        // Update the provider record if it exists
        const updateParams = {
            TableName: 'Provider',
            Key: {
                providerID: id,
            },
            UpdateExpression:
                'set #n = :name, phoneNumber = :phoneNumber, address = :address, DOB = :DOB, gender = :gender, ' +
                'personalEmail = :personalEmail, specialization = :specialization, licenseNumber = :licenseNumber, ' +
                'yearsOfExperience = :yearsOfExperience, consultationFee = :consultationFee, availability = :availability, ' +
                'availabilityStatus = :availabilityStatus',
            ExpressionAttributeNames: {
                '#n': 'name',
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':phoneNumber': phoneNumber,
                ':address': address,
                ':DOB': DOB,
                ':gender': gender,
                ':personalEmail': personalEmail,
                ':specialization': specialization,
                ':licenseNumber': licenseNumber,
                ':yearsOfExperience': yearsOfExperience,
                ':consultationFee': consultationFee,
                ':availability': availability,
                ':availabilityStatus': availabilityStatus,
            },
            ReturnValues: 'ALL_NEW',
        };

        const updatedProvider = await dynamoDB.update(updateParams).promise();

        res.json({
            message: 'Provider updated successfully',
            provider: updatedProvider.Attributes,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Provider profile (Admin only)
 * @route   DELETE /api/provider/:id
 * @access  Private/Admin
 */
const deleteProviderProfile = async (req, res, next) => {
    // Ensure only admin can delete providers
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;

    try {
        // Check if the provider exists
        const getParams = {
            TableName: 'Provider',
            Key: {
                providerID: id,
            },
        };

        const provider = await dynamoDB.get(getParams).promise();

        if (!provider.Item) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        // Delete the provider record if it exists
        const deleteParams = {
            TableName: 'Provider',
            Key: {
                providerID: id,
            },
        };

        await dynamoDB.delete(deleteParams).promise();

        res.json({ message: 'Provider deleted successfully' });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    registerProvider,
    getProviderProfile,
    updateProviderProfile,
    deleteProviderProfile,
};
