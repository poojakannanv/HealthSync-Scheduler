
/**
 * Represents the schema for an Admin in DynamoDB.
 */
const AdminSchema = {
  TableName: 'Admin',
  KeySchema: [
      { AttributeName: 'adminID', KeyType: 'HASH' }, // Partition key
  ],
  AttributeDefinitions: [
      { AttributeName: 'adminID', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
  },
};

module.exports = AdminSchema;
