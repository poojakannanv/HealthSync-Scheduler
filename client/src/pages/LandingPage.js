import React from "react";
import { Container } from "@mui/material";
import CustomCarousel from "../components/landing/Carousel";
import Review from "../components/landing/Review";
import CompanyInfo from "../components/landing/CompanyInfo";
import FeatureCard from "../components/landing/FeatureCard";
import Statistics from "../components/landing/Statistics";
import SubscriptionForm from "../components/landing/SubscriptionForm";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
const LandingPage = () => {
  return (
    <div>
      <Header />
      <Container style={{ marginTop:"30px", paddingLeft: "0px", paddingRight: "0px" }}>
        <CustomCarousel />
        <FeatureCard />
        <CompanyInfo />
        <Statistics />
        <Review />
        <SubscriptionForm />
      </Container>
      <Footer />
    </div>
  );
};

export default LandingPage;
