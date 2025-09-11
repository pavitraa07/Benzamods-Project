import React from "react";
import { Helmet } from "react-helmet";
import CompanyPortfolio from "./CompanyPortfolio";
import ProductsPortfolio from "./ProductsPortfolio";
import ServicesPortfolio from "./ServicesPortfolio";
import ProjectsPortfolio from "./ProjectsPortfolio";
import ReviewsPortfolio from "./ReviewsPortfolio";
import Header from "../components/Header"
import Footer from "../components/Footer"

const Portfolio = () => {
  return (
    <div className="portfolio-container" style={{ background: "#0d0d0d", minHeight: "100vh", color: "#fff", padding: "40px" }}>
      
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Our Portfolio | Benzamods</title>
        <meta name="description" content="Explore Benzamods' portfolio including our company profile, products, services, projects, and customer reviews." />
        <meta name="keywords" content="Benzamods, Portfolio, Car Customization, Products, Services, Projects, Reviews" />
        <meta name="author" content="Benzamods" />
        <meta property="og:title" content="Benzamods Portfolio" />
        <meta property="og:description" content="Check out Benzamods' portfolio showcasing our products, services, and projects." />
      </Helmet>
      <Header/>
      <CompanyPortfolio />
      <ProductsPortfolio />
      <ServicesPortfolio />
      <ProjectsPortfolio />
      <ReviewsPortfolio />
      <Footer/>
    </div>
  );
};

export default Portfolio;
