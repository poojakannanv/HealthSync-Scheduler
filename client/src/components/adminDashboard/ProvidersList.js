import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const ProvidersList = () => {
  const providers = [];

  return (
    <TableContainer component={Paper} style={{ marginTop: "20px" }}>
      <Typography variant="h6" style={{ padding: "16px" }}>
        Providers List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Experience (Years)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell>{provider.name}</TableCell>
              <TableCell>{provider.email}</TableCell>
              <TableCell>{provider.phoneNumber}</TableCell>
              <TableCell>
                {provider.address.street}, {provider.address.city},{" "}
                {provider.address.postalCode}, {provider.address.country}
              </TableCell>
              <TableCell>{provider.DOB}</TableCell>
              <TableCell>{provider.gender}</TableCell>
              <TableCell>{provider.specialization}</TableCell>
              <TableCell>{provider.yearsOfExperience}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProvidersList;
