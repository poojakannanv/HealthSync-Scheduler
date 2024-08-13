const express = require("express");
const bodyParser = require("body-parser");
const appointmentRoutes = require("./routes/appointmentRoutes");
const sequelize = require("./utils/database");

const app = express();

app.use(bodyParser.json());

app.use("/api/appointments", appointmentRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
