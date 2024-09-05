import React from 'react';
import { TextField, Button, Typography } from '@mui/material';

const SubscriptionForm = () => {
    return (
        <div className="subscription-form">
            <Typography variant="h5" className="subscription-title">Stay Updated</Typography>
            <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                className="subscription-input"
            />
            <Button variant="contained" color="primary" className="subscription-button">
                Subscribe
            </Button>
        </div>
    );
};

export default SubscriptionForm;
