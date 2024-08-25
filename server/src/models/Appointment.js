
/**
 * Represents the schema for an Appointment in DynamoDB.
 */
const AppointmentSchema = {
    TableName: 'Appointment',
    KeySchema: [
        { AttributeName: 'appointmentID', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: 'appointmentID', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
};

module.exports = AppointmentSchema;
