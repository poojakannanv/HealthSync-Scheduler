import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Statistics = () => {
    const stats = [
        { label: "Happy Customers", value: "10 M" },
        { label: "Monthly Visitors", value: "05 M" },
        { label: "Countries Worldwide", value: "234" },
        { label: "Trust Pilot", value: "4.3" },
    ];

    return (
        <div className="statistics-section">
            <Card className="statistics-card">
                <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar className="statistics-avatar">
                                <CheckCircleIcon className="statistics-icon" />
                            </Avatar>
                        </Grid>
                        {stats.map((stat, index) => (
                            <Grid item xs key={index}>
                                <Typography variant="h6" className="statistics-value">
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" className="statistics-label">
                                    {stat.label}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default Statistics;
