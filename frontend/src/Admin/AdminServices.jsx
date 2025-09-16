import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

async function getService() {
  const res = await fetch(`${API_BASE}/services`);
  return res.json();
}

async function addService(service) {
  await fetch(`${API_BASE}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
}

async function updateService(id, service) {
  await fetch(`${API_BASE}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
}

async function deleteService(id) {
  await fetch(`${API_BASE}/services/${id}`, { method: "DELETE" });
}

function AdminServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const data = await getService();
    setServices(data);
    setFilteredServices(data);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    await addService(serviceForm);
    fetchServices();
    setServiceForm({ name: "", price: "", description: "", image: "" });
  };

  const handleDeleteService = async (id) => {
    await deleteService(id);
    fetchServices();
  };

  const handleUpdateService = async () => {
    if (!editingService) return;
    await updateService(editingService._id, editingService);
    setEditingService(null);
    fetchServices();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter((s) =>
      s.name.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  return (
    <>
      <div style={formCardStyle}>
        <h2 style={{ marginBottom: "15px" }}>Add Service</h2>

        <form onSubmit={handleServiceSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Service Name"
            value={serviceForm.name}
            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={serviceForm.price}
            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
            style={inputStyle}
            required
          />
          <textarea
            placeholder="Description"
            value={serviceForm.description}
            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={serviceForm.image}
            onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Add Service
          </button>
        </form>
      </div>

      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={handleSearch}
          style={inputStyle}
        />
      </div>
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredServices.map((s) => (
          <div
            key={s._id}
            style={{
              background: "#222",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            {s.image && (
              <img
                src={s.image}
                alt={s.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <h3>{s.name}</h3>
            <p>₹{s.price}</p>
            <p style={{ fontSize: "14px", color: "#aaa" }}>{s.description}</p>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handleDeleteService(s._id)}
                style={{ ...buttonStyle, background: "#fff", color: "#000", marginRight: "10px" }}
              >
                Delete
              </button>
              <button
                onClick={() => setEditingService(s)}
                style={{ ...buttonStyle, background: "#fff", color: "#000" }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingService && (
        <div style={dialogStyle}>
          <div style={dialogBoxStyle}>
            <h2>Edit Service</h2>
            <input
              type="text"
              value={editingService.name}
              onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              value={editingService.price}
              onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
              style={inputStyle}
            />
            <textarea
              value={editingService.description}
              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
            <input
              type="text"
              value={editingService.image}
              onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
              style={inputStyle}
              placeholder="Image URL"
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={handleUpdateService} style={{ ...buttonStyle, background: "#000", color: "#fff" }}>
                Save
              </button>
              <button
                onClick={() => setEditingService(null)}
                style={{ ...buttonStyle, background: "#6c757d", color: "#fff" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const formCardStyle = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "12px",
  maxWidth: "450px",
  margin: "0 auto",
};
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#2c2c2c",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};
const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  background: "#fff",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold",
};
const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const dialogBoxStyle = {
  background: "#fff",
  color: "#000",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default AdminServices;
