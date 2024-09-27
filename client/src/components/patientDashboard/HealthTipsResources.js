import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";

const HealthTipsResources = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Health Tips & Resources
      </Typography>

      <Typography variant="h5" gutterBottom>
        Categories
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Nutrition</Typography>
              <Typography variant="body2">
                Learn about healthy eating habits and dietary plans.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Exercise</Typography>
              <Typography variant="body2">
                Find tips on staying active and maintaining physical fitness.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Mental Health</Typography>
              <Typography variant="body2">
                Resources for mental well-being and stress management.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider style={{ margin: "20px 0" }} />

      <Typography variant="h5" gutterBottom>
        Featured Tips
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Stay Hydrated</Typography>
              <Typography variant="body2">
                Drinking enough water each day is crucial for many reasons,
                including regulating body temperature, keeping joints lubricated,
                delivering nutrients to cells, and keeping organs functioning properly.
              </Typography>
              <Button variant="contained" color="primary" style={{ marginTop: "10px" }}>
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Daily Exercise</Typography>
              <Typography variant="body2">
                Regular physical activity can improve your muscle strength and
                boost your endurance. Exercise delivers oxygen and nutrients to
                your tissues and helps your cardiovascular system work more
                efficiently.
              </Typography>
              <Button variant="contained" color="primary" style={{ marginTop: "10px" }}>
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider style={{ margin: "20px 0" }} />

      <Typography variant="h5" gutterBottom>
        Resources
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="World Health Organization (WHO)"
            secondary="https://www.who.int"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Centers for Disease Control and Prevention (CDC)"
            secondary="https://www.cdc.gov"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="National Institutes of Health (NIH)"
            secondary="https://www.nih.gov"
          />
        </ListItem>
      </List>
    </Container>
  );
};

export default HealthTipsResources;
