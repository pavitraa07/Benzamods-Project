import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Homepage from "./Pages/Homepage";
import ExploreServices from "./Services/ExploreServices";
import AdminDashboard from "./Admin/AdminDashboard";
import Customization from "./Services/Customization";
import Upgrade from "./Services/Upgrade";
import Tuning from "./Services/Tuning";
import PriorityServices from "./Services/PriorityServices/PriorityServices";
import CarServices from "./Services/PriorityServices/CarServices"; 
import BikeServices from "./Services/PriorityServices/BikeServices"; 
import ShopByCar from "./Products/ShopByCar";
import ShopByBike from "./Products/ShopByBike";
import ServiceDetails from "./Services/PriorityServices/ServiceDetails";
import Login from "./auth/Login";
import ManageProfile from "./auth/ManageProfile";
import Register from "./auth/Register";
import Map from "./contact/Map"; 
import Cart from "./Products/Cart";
import Contact from "./contact/Contact"; 
import Order from "./orders/Order";
import ManageOrders from "./orders/ManageOrders";
import Portfolio from "./portfolio/Portfolio";
import AdminPanel from "./auth/AdminPanel";
import ProductsPortfolioDetails from "./portfolio/ProductsPortfolioDetails";
import ServicesPortfolioDetails from "./portfolio/ServicesPortfolioDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Helmet>
          <title>
            Car & Bike Mods for Enthusiasts, Dealerships & Garages | Benzamods
          </title>
          <meta
            name="description"
            content="Benzamods provides premium car and bike tuning, custom mods, and workshop solutions for enthusiasts, dealerships, resellers, and garage owners."
          />
          <meta
            name="keywords"
            content="car mods, bike mods, car enthusiasts, bike hobbyists, vehicle tuners, dealerships, resellers, workshop services, garage solutions"
          />
        </Helmet>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manageprofile" element={<ManageProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore-services" element={<ExploreServices />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/tuning" element={<Tuning />} />
          <Route path="/services/priority-services" element={<PriorityServices />} />
          <Route path="/services/priority-services/car" element={<CarServices />} />
          <Route path="/services/priority-services/bike" element={<BikeServices />} />
          <Route path="/priority-services/:id" element={<ServiceDetails />} />
          <Route path="/shopbycar" element={<ShopByCar />} />
          <Route path="/shopbybike" element={<ShopByBike />} />
          <Route path="/map" element={<Map />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />
          <Route path="/manageorders" element={<ManageOrders />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/productsportfoliodetails/:id" element={<ProductsPortfolioDetails />} />
          <Route path="/servicesportfoliodetails/:id" element={<ServicesPortfolioDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
