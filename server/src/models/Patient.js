
/**
 * Represents the schema for a Patient in DynamoDB.
 */
const PatientSchema = {
  TableName: 'Patient',
  KeySchema: [
      { AttributeName: 'patientID', KeyType: 'HASH' } // Partition key
  ],
  AttributeDefinitions: [
      { AttributeName: 'patientID', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
  },
};

module.exports = PatientSchema;
