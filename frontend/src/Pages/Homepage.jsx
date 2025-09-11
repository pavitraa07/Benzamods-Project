import HeroBanner from "../components/HeroBanner";
import QuickNavigation from "../components/QuickNavigation";
import FeaturedServices from "../components/FeaturedServices";
import ClientCarousel from "../components/ClientCarousel";
import Footer from "../components/Footer";

function Homepage() {
  return (
    <div>
      <HeroBanner />

      <div id="shop">
        <QuickNavigation />
      </div>

      <div id="services">
        <FeaturedServices />
      </div>

      <div id="reviews">
        <ClientCarousel />
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;
