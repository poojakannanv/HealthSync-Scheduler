const express = require("express");
const { loginUser } = require("../controllers/authController");

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login a user (Admin, Provider, or Patient)
router.post("/login", loginUser);

module.exports = router;
