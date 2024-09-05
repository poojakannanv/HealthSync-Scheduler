import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import user1 from '../../assets/user1.jpg';
import user2 from '../../assets/user2.jpg';
import user3 from '../../assets/user3.jpg';

const Review = () => {
  const reviews = [
    {
      text: "HealthSync has changed the way I manage my health. It's simple and easy to use!",
      userName: "Ayleen Aristotle",
      userImage: user1,
      rating: 5,
    },
    {
      text: "The appointment booking feature is a lifesaver. I can book a consultation in minutes.",
      userName: "Michael Johnson",
      userImage: user2,
      rating: 4,
    },
    {
      text: "The telehealth service is top-notch! Highly recommended.",
      userName: "Jane Smith",
      userImage: user3,
      rating: 5,
    },
  ];

  return (
    <div className="review-section">
      <Typography variant="h5" className="review-title">
        What our users say
      </Typography>
      <Grid container spacing={3} className="review-grid">
        {reviews.map((review, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card className="review-card">
              <CardContent>
                <Avatar
                  src={review.userImage}
                  alt={review.userName}
                  className="review-avatar"
                />
                <Typography variant="h6" className="review-username">
                  {review.userName}
                </Typography>
                <Box className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </Box>
                <Typography variant="body2" className="review-text">
                  {review.text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Review;
