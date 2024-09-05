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
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";

import UserManagement from "../../components/adminDashboard/UserManagement";
import CreateProvider from "../../components/adminDashboard/CreateProvider";
import ProfileManagement from "../../components/adminDashboard/ProfileManagement";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("CreateProvider");

  const handleListItemClick = (section) => {
    setSelectedSection(section);
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case "CreateProvider":
        return <CreateProvider />;
      case "Users":
        return <UserManagement />;
      case "Profile":
        return <ProfileManagement />;
      default:
        return <UserManagement />;
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
              selected={selectedSection === "CreateProvider"} // Add the new list item
              onClick={() => handleListItemClick("CreateProvider")}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Create Provider" />
            </ListItem>
            <ListItem
              button
              selected={selectedSection === "Users"}
              onClick={() => handleListItemClick("Users")}
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
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
          </List>
        </Drawer>
        <Box sx={{ flexGrow: 1, padding: 3 }}>{renderSectionContent()}</Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminDashboard;
