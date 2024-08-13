const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointmentTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Appointment;
