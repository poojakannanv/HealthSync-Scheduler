import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { AccessTime, LocalHospital, EventAvailable } from '@mui/icons-material';

const FeatureCard = () => {
    const features = [
        {
            icon: <AccessTime className="feature-icon" />,
            title: "24/7 Availability",
            description: "Connect with healthcare providers at any time of the day.",
        },
        {
            icon: <LocalHospital className="feature-icon" />,
            title: "Telehealth Services",
            description: "Attend consultations from the comfort of your home.",
        },
        {
            icon: <EventAvailable className="feature-icon" />,
            title: "Easy Appointment Booking",
            description: "Schedule appointments with just a few clicks and minutes.",
        },
    ];

    return (
        <div className="feature-section">
            <Grid container spacing={4} className="feature-grid">
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card className="feature-card">
                            <CardContent>
                                {feature.icon}
                                <Typography variant="h6" className="feature-title">
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" className="feature-description">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default FeatureCard;
