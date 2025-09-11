import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

const fetchPortfolio = async () => {
  const [productsRes, servicesRes, projectsRes, reviewsRes] = await Promise.all([
    fetch(`${API_BASE}/portfolio/products`),
    fetch(`${API_BASE}/portfolio/services`),
    fetch(`${API_BASE}/portfolio/projects`),
    fetch(`${API_BASE}/portfolio/reviews`)
  ]);

  return {
    products: await productsRes.json(),
    services: await servicesRes.json(),
    projects: await projectsRes.json(),
    reviews: await reviewsRes.json()
  };
};

const addPortfolioItem = async (section, item) => {
  const res = await fetch(`${API_BASE}/portfolio/${section}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
};

const updatePortfolioItem = async (section, index, item) => {
  const res = await fetch(`${API_BASE}/portfolio/${section}/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
};

const deletePortfolioItem = async (section, index) => {
  await fetch(`${API_BASE}/portfolio/${section}/${index}`, { method: "DELETE" });
};

function AdminPortfolio() {
  const [portfolio, setPortfolio] = useState({
    products: [],
    services: [],
    projects: [],
    reviews: [],
  });

  const [forms, setForms] = useState({
    products: { name: "", description: "", detailedDesc: "", image: "", gallery: "" },
    services: { name: "", description: "", detailedDesc: "", image: "", gallery: "" },
    projects: { title: "", description: "", category: "Car", brand: "", serviceType: "", beforeImages: [""], afterImages: [""] },
  });

  const [editing, setEditing] = useState({
    products: null,
    services: null,
    projects: null,
    reviews: null,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    const data = await fetchPortfolio();
    setPortfolio(data || { products: [], services: [], projects: [], reviews: [] });
  };

  const handleSubmit = async (section) => {
    let payload = { ...forms[section] };
    if (payload.gallery) {
      payload.gallery = payload.gallery.split(",").slice(0, 5).map(url => url.trim());
    }
    await addPortfolioItem(section, payload);
    setForms(prev => ({ ...prev, [section]: resetForm(section) }));
    fetchPortfolioData();
  };

  const handleDelete = async (section, index) => {
    await deletePortfolioItem(section, index);
    fetchPortfolioData();
  };

  const handleUpdate = async (section) => {
    const { index, data } = editing[section];
    let payload = { ...data };
    if (payload.gallery) {
      payload.gallery = payload.gallery.split(",").slice(0, 5).map(url => url.trim());
    }
    await updatePortfolioItem(section, index, payload);
    setEditing(prev => ({ ...prev, [section]: null }));
    fetchPortfolioData();
  };

  const resetForm = (section) => {
    switch (section) {
      case "products": return { name: "", description: "", detailedDesc: "", image: "", gallery: "" };
      case "services": return { name: "", description: "", detailedDesc: "", image: "", gallery: "" };
      case "projects": return { title: "", description: "", category: "Car", brand: "", serviceType: "", beforeImages: [""], afterImages: [""] };
      default: return {};
    }
  };

  const renderForm = (section, fields) => (
    <div style={formCardStyle}>
      <h2>Add {section.charAt(0).toUpperCase() + section.slice(1)}</h2>
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(section); }}
        style={formStyle}
      >
        {fields.map(f => {
          if (f.type === "text" || f.type === "number") {
            return (
              <input
                key={f.name}
                type={f.type}
                placeholder={f.placeholder}
                value={forms[section][f.name]}
                onChange={(e) => setForms(prev => ({
                  ...prev,
                  [section]: { ...prev[section], [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value }
                }))}
                style={inputStyle}
                required={f.required}
              />
            );
          }
          if (f.type === "textarea") {
            return (
              <textarea
                key={f.name}
                placeholder={f.placeholder}
                value={forms[section][f.name]}
                onChange={(e) => setForms(prev => ({ ...prev, [section]: { ...prev[section], [f.name]: e.target.value } }))}
                style={{ ...inputStyle, minHeight: "80px" }}
              />
            );
          }
          if (f.type === "arrayText") {
            return forms[section][f.name].map((val, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`${f.placeholder} ${idx + 1}`}
                value={val}
                onChange={(e) => {
                  const arr = [...forms[section][f.name]];
                  arr[idx] = e.target.value;
                  setForms(prev => ({ ...prev, [section]: { ...prev[section], [f.name]: arr } }));
                }}
                style={inputStyle}
              />
            ));
          }
          if (f.type === "select") {
            return (
              <select
                key={f.name}
                value={forms[section][f.name]}
                onChange={(e) => setForms(prev => ({ ...prev, [section]: { ...prev[section], [f.name]: e.target.value } }))}
                style={inputStyle}
              >
                {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            );
          }
          return null;
        })}
        <button type="submit" style={buttonStyle}>Add {section.charAt(0).toUpperCase() + section.slice(1)}</button>
      </form>
    </div>
  );

  const renderCards = (section, items, isProject = false, isReview = false) => {
    let filtered = items;
    if (search.trim()) {
      filtered = items.filter(item =>
        (item.name || item.title || "").toLowerCase().startsWith(search.toLowerCase())
      );
    }

    return (
      <div style={{ marginTop: "20px" }}>
        <h2 style={{ color: "#fff", marginBottom: "10px" }}>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
        <div style={gridStyle}>
          {filtered.map((item, index) => (
            <div key={index} style={cardStyle}>
              <h3>{item.name || item.title}</h3>
              {!isProject && !isReview && item.description && (
                <p style={{ fontSize: "14px", color: "#aaa" }}>{item.description}</p>
              )}
              {item.image && <img src={item.image} alt={item.name || item.title} style={cardImageStyle} />}
              {item.gallery && item.gallery.length > 0 && (
                <div style={{ display: "flex", gap: "5px", marginTop: "8px", flexWrap: "wrap" }}>
                  {item.gallery.map((url, i) => url && (
                    <img key={i} src={url} alt={`gallery-${i}`} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                  ))}
                </div>
              )}
              {isProject && item.beforeImages?.map((img, i) => img && <img key={i} src={img} alt="before" style={cardImageStyle} />)}
              {isProject && item.afterImages?.map((img, i) => img && <img key={i} src={img} alt="after" style={cardImageStyle} />)}
              {isReview && item.beforeImage && <img src={item.beforeImage} alt="before" style={cardImageStyle} />}
              {isReview && item.afterImage && <img src={item.afterImage} alt="after" style={cardImageStyle} />}
              {(isProject || isReview) && (
                <>
                  {item.description && <p style={{ fontSize: "14px", color: "#aaa" }}>{item.description}</p>}
                  {item.detailedDesc && <p style={{ fontSize: "13px", color: "#bbb" }}>{item.detailedDesc}</p>}
                </>
              )}
              {item.rating && <p>Rating: {item.rating}</p>}
              {item.text && <p>{item.text}</p>}
              {item.category && <p>Category: {item.category}</p>}
              {item.brand && <p>Brand: {item.brand}</p>}
              {item.serviceType && <p>Service: {item.serviceType}</p>}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() =>
                    setEditing(prev => ({
                      ...prev,
                      [section]: { index, data: { ...item, gallery: item.gallery?.join(",") || "" } }
                    }))
                  }
                  style={{ ...buttonStyle, marginRight: "10px" }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(section, index)} style={buttonStyle}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEditDialog = (section) => {
    if (!editing[section]) return null;
    const { data } = editing[section];

    const fieldsMap = {
      products: [
        { name: "name", type: "text", placeholder: "Product Name", required: true },
        { name: "description", type: "textarea", placeholder: "Short Description" },
        { name: "detailedDesc", type: "textarea", placeholder: "Detailed Description" },
        { name: "image", type: "text", placeholder: "Main Image URL" },
        { name: "gallery", type: "text", placeholder: "Gallery Image URLs (comma separated)" }
      ],
      services: [
        { name: "name", type: "text", placeholder: "Service Name", required: true },
        { name: "description", type: "textarea", placeholder: "Short Description" },
        { name: "detailedDesc", type: "textarea", placeholder: "Detailed Description" },
        { name: "image", type: "text", placeholder: "Main Image URL" },
        { name: "gallery", type: "text", placeholder: "Gallery Image URLs (comma separated)" },
      ],
      projects: [
        { name: "title", type: "text", placeholder: "Project Title", required: true },
        { name: "description", type: "textarea", placeholder: "Description" },
        { name: "category", type: "select", options: ["Car", "Bike"] },
        { name: "brand", type: "text", placeholder: "Brand" },
        { name: "serviceType", type: "text", placeholder: "Service Type" },
        { name: "beforeImages", type: "arrayText", placeholder: "Before Image URL" },
        { name: "afterImages", type: "arrayText", placeholder: "After Image URL" }
      ]
    };

    const fields = fieldsMap[section];

    return (
      <div style={dialogStyle}>
        <div style={dialogBoxStyle}>
          <h2>Edit {section.charAt(0).toUpperCase() + section.slice(1)}</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); handleUpdate(section); }}
            style={formStyle}
          >
            {fields.map(f => {
              if (f.type === "text" || f.type === "number") {
                return (
                  <input
                    key={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={data[f.name]}
                    onChange={(e) =>
                      setEditing(prev => ({
                        ...prev,
                        [section]: {
                          ...prev[section],
                          data: { ...prev[section].data, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value }
                        }
                      }))
                    }
                    style={inputStyle}
                    required={f.required}
                  />
                );
              }
              if (f.type === "textarea") {
                return (
                  <textarea
                    key={f.name}
                    placeholder={f.placeholder}
                    value={data[f.name]}
                    onChange={(e) => setEditing(prev => ({
                      ...prev,
                      [section]: { ...prev[section], data: { ...prev[section].data, [f.name]: e.target.value } }
                    }))}
                    style={{ ...inputStyle, minHeight: "80px" }}
                  />
                );
              }
              if (f.type === "arrayText") {
                return data[f.name].map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`${f.placeholder} ${idx + 1}`}
                    value={val}
                    onChange={(e) => {
                      const arr = [...data[f.name]];
                      arr[idx] = e.target.value;
                      setEditing(prev => ({
                        ...prev,
                        [section]: { ...prev[section], data: { ...prev[section].data, [f.name]: arr } }
                      }));
                    }}
                    style={inputStyle}
                  />
                ));
              }
              if (f.type === "select") {
                return (
                  <select
                    key={f.name}
                    value={data[f.name]}
                    onChange={(e) =>
                      setEditing(prev => ({
                        ...prev,
                        [section]: { ...prev[section], data: { ...prev[section].data, [f.name]: e.target.value } }
                      }))
                    }
                    style={inputStyle}
                  >
                    {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                );
              }
              return null;
            })}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" style={buttonStyle}>Save</button>
              <button type="button" onClick={() => setEditing(prev => ({ ...prev, [section]: null }))} style={{ ...buttonStyle, background: "#6c757d" }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gap: "40px" }}>
      <div style={formsContainerStyle}>
        {renderForm("products", [
          { name: "name", type: "text", placeholder: "Product Name", required: true },
          { name: "description", type: "textarea", placeholder: "Short Description" },
          { name: "detailedDesc", type: "textarea", placeholder: "Detailed Description" },
          { name: "image", type: "text", placeholder: "Main Image URL" },
          { name: "gallery", type: "text", placeholder: "Gallery Image URLs (comma separated)" }
        ])}

        {renderForm("services", [
          { name: "name", type: "text", placeholder: "Service Name", required: true },
          { name: "description", type: "textarea", placeholder: "Short Description" },
          { name: "detailedDesc", type: "textarea", placeholder: "Detailed Description" },
          { name: "image", type: "text", placeholder: "Main Image URL" },
          { name: "gallery", type: "text", placeholder: "Gallery Image URLs (comma separated)" },
        ])}

        {renderForm("projects", [
          { name: "title", type: "text", placeholder: "Project Title", required: true },
          { name: "description", type: "textarea", placeholder: "Description" },
          { name: "category", type: "select", options: ["Car", "Bike"] },
          { name: "brand", type: "text", placeholder: "Brand" },
          { name: "serviceType", type: "text", placeholder: "Service Type" },
          { name: "beforeImages", type: "arrayText", placeholder: "Before Image URL" },
          { name: "afterImages", type: "arrayText", placeholder: "After Image URL" }
        ])}
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, maxWidth: "400px", width: "100%" }}
        />
      </div>

      {renderCards("products", portfolio.products)}
      {renderCards("services", portfolio.services)}
      {renderCards("projects", portfolio.projects, true)}
      {renderCards("reviews", portfolio.reviews, false, true)}

      {renderEditDialog("products")}
      {renderEditDialog("services")}
      {renderEditDialog("projects")}
    </div>
  );
}

const formCardStyle = { background: "#1c1c1c", padding: "20px", borderRadius: "12px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #444", background: "#2c2c2c", color: "#fff" };
const formsContainerStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" };
const buttonStyle = { padding: "10px 15px", border: "none", borderRadius: "6px", background: "#fff", color: "#000", cursor: "pointer", fontWeight: "bold" };
const gridStyle = { marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" };
const cardStyle = { background: "#222", borderRadius: "10px", padding: "15px", textAlign: "center" };
const cardImageStyle = { width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" };
const dialogStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const dialogBoxStyle = { background: "#1c1c1c", color: "#fff", padding: "20px", borderRadius: "10px", minWidth: "400px", display: "flex", flexDirection: "column", gap: "10px" };

export default AdminPortfolio;
