// controllers/appointmentController.js

const dynamoDB = require('../config/dbConfig');
const generateUUID = require('../utils/generateUUID');
const { generateChimeMeetingLink } = require('../utils/chimeHelper');
const { getProviderNameByID } = require('../utils/providerHelper'); // Import the function

/**
 * @desc    Book a new Appointment
 * @route   POST /api/appointment/book
 * @access  Private/Patient
 */
const bookAppointment = async (req, res, next) => {
    const { providerID, appointmentType, appointmentDateTime } = req.body;
    const patientID = req.user.id;

    try {
        // Generate a unique UUID for the appointmentID
        const appointmentID = generateUUID();

        // Initialize meetingLink as null
        let meetingLink = null;

        // If the appointment is for a video conference, generate a meeting link
        if (appointmentType === 'Video Conference') {
            const patientName = req.user.name; // Assuming name is available in the user object
            const providerName = await getProviderNameByID(providerID); // Use the imported function
            const chimeResponse = await generateChimeMeetingLink(appointmentID, patientName, providerName);
            meetingLink = chimeResponse.meetingLink;
        }

        // Create the appointment record
        const newAppointment = {
            appointmentID,
            patientID,
            providerID,
            appointmentType,
            appointmentDateTime,
            meetingLink,
            status: 'Scheduled',
        };

        const putParams = {
            TableName: 'Appointment',
            Item: newAppointment,
        };

        // Insert the new appointment record into the DynamoDB table
        await dynamoDB.put(putParams).promise();

        // Send response with appointment details
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: newAppointment,
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Get Appointment details by ID
 * @route   GET /api/appointment/:id
 * @access  Private/Patient, Provider, or Admin
 */
const getAppointmentDetails = async (req, res, next) => {
    const { id } = req.params;

    try {
        const params = {
            TableName: 'Appointment',
            Key: {
                appointmentID: id,
            },
        };

        const appointment = await dynamoDB.get(params).promise();

        if (!appointment.Item) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Ensure the user has access to view the appointment
        if (
            req.user.role !== 'ADMIN' &&
            req.user.id !== appointment.Item.patientID &&
            req.user.id !== appointment.Item.providerID
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(appointment.Item);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    bookAppointment,
    getAppointmentDetails,
};
