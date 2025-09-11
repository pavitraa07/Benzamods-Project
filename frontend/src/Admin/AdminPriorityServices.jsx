import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

async function getPriorityServices() {
  const res = await fetch(`${API_BASE}/priority-services`);
  if (!res.ok) throw new Error("Failed to fetch priority services");
  return res.json();
}

async function addPriorityService(service) {
  const res = await fetch(`${API_BASE}/priority-services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Failed to add service");
  return res.json();
}

async function updatePriorityService(id, service) {
  const res = await fetch(`${API_BASE}/priority-services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

async function deletePriorityService(id) {
  const res = await fetch(`${API_BASE}/priority-services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return res.json();
}

function AdminPriorityServices() {
  const [priorityServices, setPriorityServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceTitle: "",
    description: "",
    image: "",
    category: "",
    gallery: [],
  });
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPriorityServices();
  }, []);

  const fetchPriorityServices = async () => {
    const data = await getPriorityServices();
    setPriorityServices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPriorityService(formData);
    fetchPriorityServices();
    setFormData({ serviceTitle: "", description: "", image: "", category: "", gallery: [] });
  };

  const handleDelete = async (id) => {
    await deletePriorityService(id);
    fetchPriorityServices();
  };

  const handleUpdate = async () => {
    if (!editingService) return;
    await updatePriorityService(editingService._id, editingService);
    setEditingService(null);
    fetchPriorityServices();
  };

  const filteredServices = priorityServices.filter((ps) =>
    ps.serviceTitle.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <>
      <div style={formCardStyle}>
        <h2 style={{ marginBottom: "15px" }}>Add Priority Service</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Service Title"
            value={formData.serviceTitle}
            onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
            style={inputStyle}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ ...inputStyle, minHeight: "80px" }}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Gallery Image URLs (comma separated)"
            value={formData.gallery.join(",")}
            onChange={(e) => setFormData({ ...formData, gallery: e.target.value.split(",") })}
            style={inputStyle}
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={inputStyle}
            required
          >
            <option value="">Select Category</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
          </select>
          <button type="submit" style={buttonStyle}>
            Add Priority Service
          </button>
        </form>
      </div>

      <input
        type="text"
        placeholder="Search priority services..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ ...inputStyle, width: "100%", maxWidth: "600px", display: "block", margin: "20px auto" }}
      />

      <div style={gridStyle}>
        {filteredServices.map((ps) => (
          <div key={ps._id} style={cardStyle}>
            {ps.image && <img src={ps.image} alt={ps.serviceTitle} style={cardImageStyle} />}
            <h3>{ps.serviceTitle}</h3>
            <p style={{ fontSize: "14px", color: "#aaa" }}>{ps.description}</p>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: "#ccc" }}>
              Category: {ps.category}
            </p>

            {ps.gallery && ps.gallery.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontSize: "13px", color: "#bbb" }}>Gallery:</p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {ps.gallery.map((g, idx) => (
                    <img
                      key={idx}
                      src={g}
                      alt={`gallery-${idx}`}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => handleDelete(ps._id)} style={{ ...buttonStyle, background: "#fff", color: "#000", marginRight: "10px" }}>
                Delete
              </button>
              <button onClick={() => setEditingService(ps)} style={{ ...buttonStyle, background: "#fff", color: "#000" }}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingService && (
        <div style={dialogStyle}>
          <div style={dialogBoxStyle}>
            <h2>Edit Priority Service</h2>
            <input
              type="text"
              value={editingService.serviceTitle}
              onChange={(e) => setEditingService({ ...editingService, serviceTitle: e.target.value })}
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
            <input
              type="text"
              value={editingService.gallery ? editingService.gallery.join(",") : ""}
              onChange={(e) => setEditingService({ ...editingService, gallery: e.target.value.split(",") })}
              style={inputStyle}
              placeholder="Gallery Image URLs (comma separated)"
            />
            <select
              value={editingService.category}
              onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="">Select Category</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={handleUpdate} style={{ ...buttonStyle, background: "#000", color: "#fff" }}>Save</button>
              <button onClick={() => setEditingService(null)} style={{ ...buttonStyle, background: "#6c757d", color: "#fff" }}>Cancel</button>
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
  maxWidth: "600px",
  margin: "0 auto",
};
const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#2c2c2c", color: "#fff" };
const buttonStyle = { padding: "10px 15px", border: "none", borderRadius: "6px", background: "#fff", color: "#000", cursor: "pointer", fontWeight: "bold" };
const gridStyle = { marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" };
const cardStyle = { background: "#222", borderRadius: "10px", padding: "15px", textAlign: "center" };
const cardImageStyle = { width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" };
const dialogStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const dialogBoxStyle = { background: "#fff", color: "#000", padding: "20px", borderRadius: "10px", minWidth: "400px", display: "flex", flexDirection: "column", gap: "10px" };

export default AdminPriorityServices;
