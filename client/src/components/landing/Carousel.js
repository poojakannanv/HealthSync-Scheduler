import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Typography } from '@mui/material';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.jpg';

const CustomCarousel = () => {
    const items = [
        {
            name: "Welcome to HealthSync",
            description: "Your health, our priority.",
            img: image1
        },
        {
            name: "Book Appointments Easily",
            description: "Connect with top healthcare providers.",
            img: image2
        },
        {
            name: "Telehealth Services Available",
            description: "Attend consultations from the comfort of your home.",
            img: image3
        }
    ];

    return (
        <Carousel animation="slide" navButtonsAlwaysVisible  className='carousel-section'>
            {items.map((item, i) => (
                <Paper key={i} className="carousel-item">
                    <div className="overlay">
                        <img src={item.img} alt={item.name} className="carousel-img" />
                        <div className="text-container">
                            <Typography variant="h4" className="carousel-title">{item.name}</Typography>
                            <Typography variant="subtitle1" className="carousel-description">{item.description}</Typography>
                        </div>
                    </div>
                </Paper>
            ))}
        </Carousel>
    );
};

export default CustomCarousel;
