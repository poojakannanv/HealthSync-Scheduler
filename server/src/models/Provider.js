
/**
 * Represents the schema for a Provider in DynamoDB.
 */
const ProviderSchema = {
  TableName: 'Provider',
  KeySchema: [
      { AttributeName: 'providerID', KeyType: 'HASH' } // Partition key
  ],
  AttributeDefinitions: [
      { AttributeName: 'providerID', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
  },
};

module.exports = ProviderSchema;

