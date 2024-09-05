const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const dynamoDB = require("../config/dbConfig");
const generateUUID = require("../utils/generateUUID");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Register a new Admin
 * @route   POST /api/admin/register
 * @access  Public
 */
const registerAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phoneNumber, address, DOB, gender } = req.body;

  const role = 'ADMIN'; // Ensure role is set here

  try {
    // Check if the admin email already exists
    const params = {
      TableName: "Admin",
      IndexName: "email-index", // Assumes an email index exists
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const existingAdmin = await dynamoDB.query(params).promise();

    if (existingAdmin.Count > 0) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // Generate a unique UUID for the adminID
    const adminID = generateUUID();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin record with the correct schema
    const newAdmin = {
      adminID, // This must match the partition key in your DynamoDB table
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      phoneNumber,
      address,
      DOB,
      gender,
    };

    const putParams = {
      TableName: "Admin",
      Item: newAdmin,
    };

    // Insert the new admin record into the DynamoDB table
    await dynamoDB.put(putParams).promise();

    // Generate JWT token
    const token = generateToken(adminID, "ADMIN");

    // Send response with adminID, message, and token
    res.status(201).json({
      message: "Admin registered successfully",
      adminID, // Return the adminID in the response
      role,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Admin profile by ID
 * @route   GET /api/admin/:id
 * @access  Private/Admin
 */
const getAdminProfile = async (req, res, next) => {
  const { id } = req.params;

  try {
    const params = {
      TableName: "Admin",
      Key: {
        adminID: id,
      },
    };

    const admin = await dynamoDB.get(params).promise();

    if (!admin.Item) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin.Item);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Admin profile
 * @route   PUT /api/admin/:id
 * @access  Private/Admin
 */
const updateAdminProfile = async (req, res, next) => {
  const { id } = req.params;
  const { name, phoneNumber, address, DOB, gender } = req.body;

  try {
    // Check if the admin exists
    const getParams = {
      TableName: "Admin",
      Key: {
        adminID: id,
      },
    };

    const admin = await dynamoDB.get(getParams).promise();

    if (!admin.Item) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update the admin record if it exists
    const updateParams = {
      TableName: "Admin",
      Key: {
        adminID: id,
      },
      UpdateExpression:
        "set #n = :name, phoneNumber = :phoneNumber, address = :address, DOB = :DOB, gender = :gender",
      ExpressionAttributeNames: {
        "#n": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
        ":phoneNumber": phoneNumber,
        ":address": address,
        ":DOB": DOB,
        ":gender": gender,
      },
      ReturnValues: "ALL_NEW",
    };

    const updatedAdmin = await dynamoDB.update(updateParams).promise();

    res.json({
      message: "Admin updated successfully",
      admin: updatedAdmin.Attributes,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Delete Admin profile
 * @route   DELETE /api/admin/:id
 * @access  Private/Admin
 */
const deleteAdminProfile = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the admin exists
    const getParams = {
      TableName: "Admin",
      Key: {
        adminID: id,
      },
    };

    const admin = await dynamoDB.get(getParams).promise();

    if (!admin.Item) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Delete the admin record if it exists
    const deleteParams = {
      TableName: "Admin",
      Key: {
        adminID: id,
      },
    };

    await dynamoDB.delete(deleteParams).promise();

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List all users from Admin, Provider, and Patient tables
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const scanTable = async (params) => {
  let items = [];
  let data;

  do {
    data = await dynamoDB.scan(params).promise();
    items = items.concat(data.Items);
    params.ExclusiveStartKey = data.LastEvaluatedKey;
  } while (typeof data.LastEvaluatedKey !== "undefined");

  return items;
};

const listAllUsers = async (req, res, next) => {
  try {
    // Fetch Admins
    const adminParams = {
      TableName: "Admin",
    };
    const admins = await scanTable(adminParams);

    // Fetch Providers
    const providerParams = {
      TableName: "Provider",
    };
    const providers = await scanTable(providerParams);

    // Fetch Patients
    const patientParams = {
      TableName: "Patient",
    };
    const patients = await scanTable(patientParams);

    // Combine all results
    const allUsers = [
      ...admins.map((admin) => ({ ...admin, role: "ADMIN" })),
      ...providers.map((provider) => ({ ...provider, role: "PROVIDER" })),
      ...patients.map((patient) => ({ ...patient, role: "PATIENT" })),
    ];

    res.json(allUsers);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  registerAdmin,
  getAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
   listAllUsers,
};
