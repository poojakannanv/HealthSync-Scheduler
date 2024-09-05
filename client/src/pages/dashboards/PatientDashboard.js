import React, { useState } from "react";
import {Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import AppointmentManagement from "../../components/patientDashboard/AppointmentManagement";
import ProfileManagement from "../../components/patientDashboard/ProfileManagement";
import HealthTipsResources from "../../components/patientDashboard/HealthTipsResources";

const drawerWidth = 240;

const PatientDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Appointments");

  const handleListItemClick = (section) => {
    setSelectedSection(section);
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case "Appointments":
        return <AppointmentManagement />;
      case "Profile":
        return <ProfileManagement />;
      case "HealthTips":
        return <HealthTipsResources />;
      default:
        return <AppointmentManagement />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "120vh" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Drawer
          className="drawer"
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <List>
            <ListItem
              button
              selected={selectedSection === "Appointments"}
              onClick={() => handleListItemClick("Appointments")}
            >
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Appointment Management" />
            </ListItem>
            <ListItem
              button
              selected={selectedSection === "Profile"}
              onClick={() => handleListItemClick("Profile")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile Management" />
            </ListItem>
            <ListItem
              button
              selected={selectedSection === "HealthTips"}
              onClick={() => handleListItemClick("HealthTips")}
            >
              <ListItemIcon>
                <HealthAndSafetyIcon />
              </ListItemIcon>
              <ListItemText primary="Health Tips and Resources" />
            </ListItem>
          </List>
        </Drawer>
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          {renderSectionContent()}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default PatientDashboard;
