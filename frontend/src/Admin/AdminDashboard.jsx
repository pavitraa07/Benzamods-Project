import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminProducts from "./AdminProducts";
import AdminServices from "./AdminServices";
import AdminPriorityServices from "./AdminPriorityServices";
import AdminContact from "./AdminContact";
import AdminPortfolio from "./AdminPortfolio";
import AdminOrders from "./AdminOrders";
import ManageAdmins from "./ManageAdmins";
import AdminUsers from "./AdminUsers";
import AdminInquiries from "./AdminInquiries";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const getProductsCount = () => axios.get(`${API_BASE}/products/count`);
const getServicesCount = () => axios.get(`${API_BASE}/services/count`);
const getPriorityCount = () => axios.get(`${API_BASE}/priority-services/count`);
const getOrdersCount = () => axios.get(`${API_BASE}/orders/count`);
const getContactsCount = () => axios.get(`${API_BASE}/contact/count`);
const getAdminsCount = () => axios.get(`${API_BASE}/admins/count`);
const getUsersCount = () => axios.get(`${API_BASE}/auth/users/count`);
const getPortfolioCount = () => axios.get(`${API_BASE}/portfolio/count`);

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [productCount, setProductCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [priorityCount, setPriorityCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [portfolioCounts, setPortfolioCounts] = useState({
    products: 0,
    services: 0,
    projects: 0,
    reviews: 0,
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/");
  };

  const fetchCounts = async () => {
    try {
      const [
        productsRes,
        servicesRes,
        priorityRes,
        ordersRes,
        contactsRes,
        adminsRes,
        usersRes,
        portfolioRes,
      ] = await Promise.all([
        getProductsCount(),
        getServicesCount(),
        getPriorityCount(),
        getOrdersCount(),
        getContactsCount(),
        getAdminsCount(),
        getUsersCount(),
        getPortfolioCount(),
      ]);

      setProductCount(productsRes.data.count);
      setServiceCount(servicesRes.data.count);
      setPriorityCount(priorityRes.data.count);
      setOrderCount(ordersRes.data.count);
      setContactCount(contactsRes.data.count);
      setAdminCount(adminsRes.data.count);
      setUserCount(usersRes.data.count);
      setPortfolioCounts({
        products: portfolioRes.data.products,
        services: portfolioRes.data.services,
        projects: portfolioRes.data.projects,
        reviews: portfolioRes.data.reviews,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

useEffect(() => {
  if (activeSection === "dashboard") {
    fetchCounts();
  }
}, [activeSection]);


  const Circle = ({ title, count }) => (
    <div style={circleStyle}>
      <div style={circleNumber}>{count}</div>
      <div style={circleTitle}>{title}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#111", color: "#fff" }}>
      <div className="sidebar-desktop" style={{ display: "none" }}>
        <Sidebar onSelect={setActiveSection} />
      </div>
      <div className="sidebar-mobile">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 1100,
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            background: "#fff",
            color: "#000",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ☰
        </button>
        {isMobileSidebarOpen && (
          <div style={mobileSidebarOverlay}>
            <div style={mobileSidebar}>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "20px",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
              <Sidebar
                onSelect={(section) => {
                  setActiveSection(section);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
          position: "relative",
          width: "100%",
        }}
      >
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            position: "absolute",
            top: "20px",
            right: "30px",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            background: "#fff",
            color: "#000",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>

        <h1 style={{ borderBottom: "2px solid #444", paddingBottom: "10px" }}>
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>

        {activeSection === "dashboard" && (
          <div style={analyticsContainer}>
            <Circle title="Products" count={productCount} />
            <Circle title="Services" count={serviceCount} />
            <Circle title="Priority Services" count={priorityCount} />
            <Circle title="Orders" count={orderCount} />
            <Circle title="Contacts" count={contactCount} />
            <Circle title="Admins" count={adminCount} />
            <Circle title="Users" count={userCount} />
            <Circle title="Portfolio Products" count={portfolioCounts.products} />
            <Circle title="Portfolio Services" count={portfolioCounts.services} />
            <Circle title="Portfolio Projects" count={portfolioCounts.projects} />
            <Circle title="Portfolio Reviews" count={portfolioCounts.reviews} />
          </div>
        )}

        {activeSection === "products" && <AdminProducts />}
        {activeSection === "services" && <AdminServices />}
        {activeSection === "priorityservices" && <AdminPriorityServices />}
        {activeSection === "contact" && <AdminContact />}
        {activeSection === "portfolio" && <AdminPortfolio />}
        {activeSection === "orders" && <AdminOrders />}
        {activeSection === "manageadmins" && <ManageAdmins />}
        {activeSection === "adminusers" && <AdminUsers />}
        {activeSection === "admininquiries" && <AdminInquiries />}
        
        {showLogoutModal && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <h3>Are you sure you want to logout?</h3>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{ ...modalButtonStyle, background: "#e74c3c", color: "#fff" }}
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{ ...modalButtonStyle, background: "#444", color: "#fff" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @media (min-width: 768px) {
            .sidebar-desktop {
              display: block !important;
            }
            .sidebar-mobile {
              display: none;
            }
          }
          @media (max-width: 767px) {
            .sidebar-desktop {
              display: none;
            }
            .sidebar-mobile {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
}

const analyticsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "25px",
  marginTop: "20px",
};

const circleStyle = {
  background: "#222",
  borderRadius: "50%",
  width: "140px",
  height: "140px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  boxShadow: "0 0 20px #000",
  margin: "auto",
};

const circleNumber = {
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "5px",
};

const circleTitle = {
  fontSize: "15px",
  color: "#aaa",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#1c1c1c",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center",
  color: "#fff",
  width: "300px",
};

const modalButtonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const mobileSidebarOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.8)",
  zIndex: 1000,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "stretch",
};

const mobileSidebar = {
  background: "#1c1c1c",
  width: "250px",
  height: "100%",
  padding: "20px",
  position: "relative",
};

export default AdminDashboard;
