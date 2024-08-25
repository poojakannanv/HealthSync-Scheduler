// utils/chimeHelper.js

const { ChimeSDKMeetingsClient, CreateMeetingCommand, CreateAttendeeCommand } = require('@aws-sdk/client-chime-sdk-meetings');

// Initialize Chime SDK Meetings client
const chimeSDKMeetingsClient = new ChimeSDKMeetingsClient({
    region: 'us-east-1', // Chime Meetings are available in 'us-east-1'
});

/**
 * Generates a Chime meeting and attendee link for video appointments.
 * @param {string} appointmentID - The unique ID of the appointment.
 * @param {string} patientName - Name of the patient attending the meeting.
 * @param {string} providerName - Name of the provider attending the meeting.
 * @returns {Promise<{meetingLink: string}>} - A promise that resolves to the meeting link.
 */
const generateChimeMeetingLink = async (appointmentID, patientName, providerName) => {
    try {
        // Create a meeting with a unique ExternalMeetingId
        const meetingResponse = await chimeSDKMeetingsClient.send(new CreateMeetingCommand({
            ClientRequestToken: appointmentID,
            MediaRegion: 'us-east-1',
            ExternalMeetingId: `meeting-${appointmentID}`, // Ensure this is a unique value
        }));

        // Create an attendee for the patient
        await chimeSDKMeetingsClient.send(new CreateAttendeeCommand({
            MeetingId: meetingResponse.Meeting.MeetingId,
            ExternalUserId: patientName,
        }));

        // Create an attendee for the provider
        await chimeSDKMeetingsClient.send(new CreateAttendeeCommand({
            MeetingId: meetingResponse.Meeting.MeetingId,
            ExternalUserId: providerName,
        }));

        // Generate the meeting link
        const meetingLink = `https://app.chime.aws/portal/${meetingResponse.Meeting.MeetingId}`;

        return { meetingLink };
    } catch (error) {
        throw new Error(`Failed to create Chime meeting: ${error.message}`);
    }
};

module.exports = {
    generateChimeMeetingLink,
};
