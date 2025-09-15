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

  const sectionLabels = {
  dashboard: "Dashboard",
  products: "Products",
  services: "Services",
  priorityservices: "Priority Services",
  contact: "Contact Messages",
  portfolio: "Portfolio",
  orders: "Orders",
  manageadmins: "Admins",
  adminusers: "Users",
  admininquiries: "Inquiries",
};

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

  const Circle = ({ title, count, index }) => (
    <div
      className="circle"
      style={{ ...circleStyle, animationDelay: `${index * 0.15}s` }}
    >
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
          <div style={mobileSidebarOverlay} className="mobile-overlay">
            <div style={mobileSidebar} className="mobile-sidebar-enter-active">
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
        {sectionLabels[activeSection] || ""}
       </h1>
       
        {activeSection === "dashboard" && (
          <div style={analyticsContainer}>
            <Circle title="Products" count={productCount} index={0} />
            <Circle title="Services" count={serviceCount} index={1} />
            <Circle title="Priority Services" count={priorityCount} index={2} />
            <Circle title="Orders" count={orderCount} index={3} />
            <Circle title="Contacts" count={contactCount} index={4} />
            <Circle title="Admins" count={adminCount} index={5} />
            <Circle title="Users" count={userCount} index={6} />
            <Circle title="Portfolio Products" count={portfolioCounts.products} index={7} />
            <Circle title="Portfolio Services" count={portfolioCounts.services} index={8} />
            <Circle title="Portfolio Projects" count={portfolioCounts.projects} index={9} />
            <Circle title="Portfolio Reviews" count={portfolioCounts.reviews} index={10} />
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
            <div style={modalStyle} className="modal">
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

          /* Circle pop-in animation with stagger */
          .circle {
            animation: popIn 0.6s ease forwards;
            transform: scale(0.7);
            opacity: 0;
          }
          @keyframes popIn {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          /* Mobile sidebar slide-in */
          .mobile-sidebar {
            transform: translateX(-100%);
            animation: slideIn 0.4s forwards;
          }
          @keyframes slideIn {
            to {
              transform: translateX(0);
            }
          }

          /* Modal fade + scale */
          .modal {
            animation: fadeScale 0.3s ease forwards;
            transform: scale(0.8);
            opacity: 0;
          }
          @keyframes fadeScale {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
                    /* Desktop sidebar fade + slide */
        .sidebar-desktop {
          animation: sidebarDesktopSlide 0.5s ease forwards;
          transform: translateX(-20px);
          opacity: 0;
        }
        @keyframes sidebarDesktopSlide {
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Mobile sidebar slide-in and slide-out */
        .mobile-sidebar-enter {
          transform: translateX(-100%);
          opacity: 0;
        }
        .mobile-sidebar-enter-active {
          transform: translateX(0);
          opacity: 1;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .mobile-sidebar-exit {
          transform: translateX(0);
          opacity: 1;
        }
        .mobile-sidebar-exit-active {
          transform: translateX(-100%);
          opacity: 0;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        /* Overlay fade effect for mobile */
        .mobile-overlay {
          animation: fadeOverlay 0.4s ease forwards;
          opacity: 0;
        }
        @keyframes fadeOverlay {
          to {
            opacity: 1;
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
