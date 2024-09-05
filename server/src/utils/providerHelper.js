
const dynamoDB = require('../config/dbConfig');

/**
 * Retrieves the provider's name by their ID.
 * @param {string} providerID - The unique ID of the provider.
 * @returns {Promise<string>} - A promise that resolves to the provider's name.
 */
const getProviderNameByID = async (providerID) => {
    const params = {
        TableName: 'Provider',
        Key: {
            providerID,
        },
    };

    const provider = await dynamoDB.get(params).promise();

    if (!provider.Item) {
        throw new Error('Provider not found');
    }

    return provider.Item.name;
};

module.exports = {
    getProviderNameByID,
};
