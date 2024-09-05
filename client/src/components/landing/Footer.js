import React from 'react';
import { Typography } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';

const Footer = () => {
    return (
        <footer className="footer">
            <Typography variant="body2" className="footer-text">Follow us on social media</Typography>
            <div className="footer-icons">
                <Facebook className="footer-icon" />
                <Twitter className="footer-icon" />
                <LinkedIn className="footer-icon" />
                <Instagram className="footer-icon" />
            </div>
        </footer>
    );
};

export default Footer;
