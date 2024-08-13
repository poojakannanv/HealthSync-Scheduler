const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
  const { patientId, providerId, appointmentTime } = req.body;

  try {
    const appointment = await Appointment.create({
      patientId,
      providerId,
      appointmentTime,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to book appointment" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};
