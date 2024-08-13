const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.post("/book", appointmentController.bookAppointment);
router.get("/", appointmentController.getAppointments);

module.exports = router;
