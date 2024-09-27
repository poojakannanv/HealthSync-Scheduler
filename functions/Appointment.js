const AWS = require("aws-sdk");
const { google } = require("googleapis");
const axios = require("axios");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS({ region: "eu-west-2" });
const ses = new AWS.SES({ region: "eu-west-2" });
const { v4: uuidv4 } = require("uuid");

// Google Calendar Setup
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS); // Add the service account credentials in the environment variable
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Create an OAuth2 client
const auth = new google.auth.JWT(
  GOOGLE_CREDENTIALS.client_email,
  null,
  GOOGLE_CREDENTIALS.private_key,
  SCOPES
);

// Main Lambda handler
exports.handler = async (event) => {
  let body;

  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else {
      throw new Error("event.body is not a string");
    }

    const { patientID, preferredDate, appointmentType, specialization } = body;

    if (!patientID || !preferredDate || !appointmentType || !specialization) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Missing required fields: patientID, preferredDate, appointmentType, specialization",
        }),
      };
    }

    const patient = await fetchPatientByID(patientID);

    // Step 1: Fetch all providers with the required specialization
    const providers = await fetchProvidersBySpecialization(specialization);

    // Step 2: Sort providers by proximity using Google Maps Distance Matrix API
    const sortedProviders = await sortProvidersByProximity(
      providers,
      patient.address
    );

    // Step 3: Check availability for the preferred date
    const availableProvider = findAvailableProvider(
      sortedProviders,
      preferredDate
    );

    if (!availableProvider) {
      throw new Error("No available providers found for the selected date.");
    }

    // Step 4: Book the first available slot
    const appointmentID = uuidv4();
    await bookAppointment(
      appointmentID,
      availableProvider.providerID,
      availableProvider.name,
      patientID,
      preferredDate,
      appointmentType
    );

    // Step 5: If video, generate a Google Meet link using Google Calendar API
    let meetingDetails = null;
    if (appointmentType === "video") {
      meetingDetails = await createGoogleMeetEvent(
        availableProvider.name,
        patient.name,
        preferredDate
      );
    }

    // Step 6: Send confirmation via SNS and SES
    await sendNotifications(
      patient,
      availableProvider,
      meetingDetails,
      preferredDate,
      appointmentType
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Appointment booked successfully",
        appointmentID,
      }),
    };
  } catch (error) {
    console.error("Error booking appointment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error booking appointment",
        error: error.message,
      }),
    };
  }
};

// Function to fetch providers based on specialization
async function fetchProvidersBySpecialization(specialization) {
  const params = {
    TableName: "Provider",
    IndexName: "specialization-index",
    KeyConditionExpression: "specialization = :specialization",
    ExpressionAttributeValues: { ":specialization": specialization },
  };
  const result = await dynamoDB.query(params).promise();
  return result.Items;
}

// Function to fetch patient details by ID
async function fetchPatientByID(patientID) {
  const params = {
    TableName: "Patient",
    Key: { patientID },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

// Function to sort providers by proximity using Google Maps API
async function sortProvidersByProximity(providers, patientAddress) {
  const destinations = providers.map(
    (provider) => provider.address.fullAddress
  ); // Assuming the provider address has a fullAddress field
  const origin = patientAddress.fullAddress; // Assuming the patient address has a fullAddress field

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${destinations
    .map(encodeURIComponent)
    .join("|")}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const distances = response.data.rows[0].elements;

    // Sort providers based on distance
    return providers
      .map((provider, index) => ({
        ...provider,
        distance: distances[index].distance.value,
      }))
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error("Error with Google Maps API:", error);
    throw new Error("Failed to fetch distances from Google Maps API");
  }
}

// Find the first available provider for the preferred date
function findAvailableProvider(providers, preferredDate) {
  for (let provider of providers) {
    const availability = provider.availability.find(
      (slot) => slot.date === preferredDate
    );
    if (
      availability &&
      availability.timeSlots.length > 0 &&
      provider.availabilityStatus === "Available"
    ) {
      return provider;
    }
  }
  return null;
}

// Book the appointment in DynamoDB
async function bookAppointment(
  appointmentID,
  providerID,
  providerName,
  patientID,
  date,
  appointmentType
) {
  const params = {
    TableName: "Appointment",
    Item: {
      appointmentID,
      providerID,
      providerName,
      patientID,
      date,
      status: "Confirmed",
      appointmentType,
    },
  };
  await dynamoDB.put(params).promise();
}

// Create a Google Meet event using Google Calendar API
async function createGoogleMeetEvent(providerName, patientName, date) {
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: `Consultation between ${providerName} and ${patientName}`,
    description: "Telehealth consultation",
    start: {
      dateTime: new Date(date).toISOString(),
      timeZone: "Europe/London",
    },
    end: {
      dateTime: new Date(
        new Date(date).getTime() + 60 * 60 * 1000
      ).toISOString(), // 1-hour duration
      timeZone: "Europe/London",
    },
    conferenceData: {
      createRequest: {
        requestId: uuidv4(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    attendees: [
      { email: "provider-email@example.com" },
      { email: "patient-email@example.com" },
    ],
  };

  const { data } = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
  });

  return { meetingLinkPatient: data.hangoutLink };
}

// Send notifications to patient and provider
async function sendNotifications(
  patient,
  provider,
  meetingDetails,
  preferredDate,
  appointmentType
) {
  const formattedDate = new Date(preferredDate).toLocaleDateString();
  const appointmentTypeText =
    appointmentType === "video"
      ? "telehealth consultation"
      : "in-person consultation";

  let emailContent = `
Dear ${patient.name},

Your appointment with ${provider.name} has been confirmed for a ${appointmentTypeText} on ${formattedDate}.
`;

  if (appointmentType === "video") {
    emailContent += `
You can join the telehealth consultation using the following link:
${meetingDetails.meetingLinkPatient}
`;
  } else {
    emailContent += `
The appointment will take place at the following address:
${provider.address.street}, ${provider.address.city}, ${provider.address.postalCode}, ${provider.address.country}
`;
  }

  const emailParams = {
    Source: "poojakannanv@gmail.com",
    Destination: {
      ToAddresses: [provider.personalEmail, patient.email],
    },
    Message: {
      Subject: {
        Data: "Your Appointment Confirmation - HealthSync",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: emailContent,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    await ses.sendEmail(emailParams).promise();
  } catch (error) {
    console.error("Error sending email:", error);
  }

  const smsContent = `
Your appointment with ${provider.name} is confirmed for ${formattedDate}.
`;

  const smsParams = {
    Message: smsContent.trim(),
    PhoneNumber: patient.phoneNumber,
  };

  try {
    await sns.publish(smsParams).promise();
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}
