import React from 'react';
import { Typography } from '@mui/material';

const CompanyInfo = () => {
    return (
        <div className="company-info">
            <Typography variant="h5" className="company-title">About HealthSync</Typography>
            <Typography variant="body1" className="company-description">
                HealthSync is dedicated to providing top-notch healthcare services at your convenience. We connect patients with experienced healthcare providers through an easy-to-use platform.
            </Typography>
        </div>
    );
};

export default CompanyInfo;
