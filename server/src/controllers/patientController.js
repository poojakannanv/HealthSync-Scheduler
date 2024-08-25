
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const dynamoDB = require('../config/dbConfig');
const generateUUID = require('../utils/generateUUID');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new Patient
 * @route   POST /api/patient/register
 * @access  Public
 */
const registerPatient = async (req, res, next) => {
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
        medicalHistory,
        currentMedication,
    } = req.body;

    try {
        // Check if the patient email already exists
        const params = {
            TableName: 'Patient',
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        const existingPatient = await dynamoDB.query(params).promise();

        if (existingPatient.Count > 0) {
            return res.status(400).json({ message: 'Patient with this email already exists' });
        }

        // Generate a unique UUID for the patientID
        const patientID = generateUUID();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the patient record with the correct schema
        const newPatient = {
            patientID,
            name,
            email,
            password: hashedPassword,
            role: 'PATIENT',
            phoneNumber,
            address,
            DOB,
            gender,
            medicalHistory,
            currentMedication,
        };

        const putParams = {
            TableName: 'Patient',
            Item: newPatient,
        };

        // Insert the new patient record into the DynamoDB table
        await dynamoDB.put(putParams).promise();

        // Generate JWT token
        const token = generateToken(patientID, 'PATIENT');

        // Send response with patientID, message, and token
        res.status(201).json({
            message: 'Patient registered successfully',
            patientID,
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Patient profile by ID
 * @route   GET /api/patient/:id
 * @access  Private/Patient or Provider or Admin
 */
const getPatientProfile = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Check if the requester has access to the patient data
        if (req.user.role !== 'ADMIN' && req.user.role !== 'PROVIDER' && req.user.id !== id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const params = {
            TableName: 'Patient',
            Key: {
                patientID: id,
            },
        };

        const patient = await dynamoDB.get(params).promise();

        if (!patient.Item) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patient.Item);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Patient profile
 * @route   PUT /api/patient/:id
 * @access  Private/Patient or Admin
 */
const updatePatientProfile = async (req, res, next) => {
    const { id } = req.params;
    const { name, phoneNumber, address, DOB, gender, medicalHistory, currentMedication } = req.body;

    try {
        // Patients can only update their own data
        if (req.user.role !== 'ADMIN' && req.user.id !== id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if the patient exists
        const getParams = {
            TableName: 'Patient',
            Key: {
                patientID: id,
            },
        };

        const patient = await dynamoDB.get(getParams).promise();

        if (!patient.Item) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Update the patient record if it exists
        const updateParams = {
            TableName: 'Patient',
            Key: {
                patientID: id,
            },
            UpdateExpression:
                'set #n = :name, phoneNumber = :phoneNumber, address = :address, DOB = :DOB, gender = :gender, ' +
                'medicalHistory = :medicalHistory, currentMedication = :currentMedication',
            ExpressionAttributeNames: {
                '#n': 'name',
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':phoneNumber': phoneNumber,
                ':address': address,
                ':DOB': DOB,
                ':gender': gender,
                ':medicalHistory': medicalHistory,
                ':currentMedication': currentMedication,
            },
            ReturnValues: 'ALL_NEW',
        };

        const updatedPatient = await dynamoDB.update(updateParams).promise();

        res.json({
            message: 'Patient updated successfully',
            patient: updatedPatient.Attributes,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Patient profile (Admin only)
 * @route   DELETE /api/patient/:id
 * @access  Private/Admin
 */
const deletePatientProfile = async (req, res, next) => {
    // Ensure only admin can delete patients
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;

    try {
        // Check if the patient exists
        const getParams = {
            TableName: 'Patient',
            Key: {
                patientID: id,
            },
        };

        const patient = await dynamoDB.get(getParams).promise();

        if (!patient.Item) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Delete the patient record if it exists
        const deleteParams = {
            TableName: 'Patient',
            Key: {
                patientID: id,
            },
        };

        await dynamoDB.delete(deleteParams).promise();

        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerPatient,
    getPatientProfile,
    updatePatientProfile,
    deletePatientProfile,
};
