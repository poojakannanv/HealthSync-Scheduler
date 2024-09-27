const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const ses = new AWS.SES({ region: "eu-west-2" });

exports.handler = async (event) => {
  try {
    console.log("Triggered reminder function");

    // Fetch reminders from DynamoDB
    const reminders = await fetchReminders();

    for (const reminder of reminders) {
      const {
        reminderID,
        patientName,
        patientEmail,
        patientPhoneNumber,
        reminderType,
        message,
        sendAt,
      } = reminder;

      // Send SMS or Email based on the reminder type
      if (reminderType === "SMS") {
        await sendSMS(patientPhoneNumber, message);
      } else if (reminderType === "Email") {
        await sendEmail(patientEmail, patientName, message);
      }

      // Mark reminder as sent or perform any necessary updates in DynamoDB
      await markReminderAsSent(reminderID);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reminders sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending reminders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error sending reminders",
        error: error.message,
      }),
    };
  }
};

// Fetch reminders due for today
async function fetchReminders() {
  const params = {
    TableName: "Reminders",
    FilterExpression: "#sendAt <= :now",
    ExpressionAttributeNames: {
      "#sendAt": "sendAt",
    },
    ExpressionAttributeValues: {
      ":now": new Date().toISOString(),
    },
  };

  const result = await dynamoDB.scan(params).promise();
  return result.Items;
}

// Send SMS via Amazon SNS
async function sendSMS(phoneNumber, message) {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  try {
    await sns.publish(params).promise();
    console.log(`SMS sent to ${phoneNumber}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${phoneNumber}:`, error);
  }
}

// Send Email via Amazon SES
async function sendEmail(email, name, message) {
  const params = {
    Source: "poojakannanv@gmail.com", // Your verified SES email address
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Your Appointment Reminder - HealthSync",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: `Dear ${name},\n\n${message}\n\nThank you for using HealthSync.`,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
}

// Mark the reminder as sent in DynamoDB
async function markReminderAsSent(reminderID) {
  const params = {
    TableName: "Reminders",
    Key: { reminderID },
    UpdateExpression: "set #sent = :sent",
    ExpressionAttributeNames: { "#sent": "sent" },
    ExpressionAttributeValues: { ":sent": true },
  };

  try {
    await dynamoDB.update(params).promise();
    console.log(`Marked reminder ${reminderID} as sent`);
  } catch (error) {
    console.error(`Failed to mark reminder ${reminderID} as sent:`, error);
  }
}
