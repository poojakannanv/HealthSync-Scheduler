import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";

import PatientManagement from "../../components/providerDashboard/PatientManagement";

import ProfileManagement from "../../components/providerDashboard/ProfileManagement";

const drawerWidth = 240;

const ProviderDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Profile");

  const handleListItemClick = (section) => {
    setSelectedSection(section);
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case "Profile":
        return <ProfileManagement />;
      case "Patients":
        return <PatientManagement />;
      default:
        return <PatientManagement />;
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
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <List>
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
              selected={selectedSection === "Patients"}
              onClick={() => handleListItemClick("Patients")}
            >
              <ListItemIcon>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText primary="Patient Management" />
            </ListItem>
          </List>
        </Drawer>
        <Box sx={{ flexGrow: 1, padding: 3 }}>{renderSectionContent()}</Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default ProviderDashboard;
