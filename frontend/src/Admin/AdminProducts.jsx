import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}

async function addProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

async function deleteProduct(id) {
  await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "car",
    description: "",
    image: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    await addProduct(productForm);
    fetchProducts();
    setProductForm({ name: "", price: "", category: "car", description: "", image: "" });
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct._id, editingProduct);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <div style={formCardStyle}>
        <h2 style={{ marginBottom: "15px" }}>Add Product</h2>

        <form onSubmit={handleProductSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Product Name"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            style={inputStyle}
            required
          />
          <select
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            style={inputStyle}
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          <textarea
            placeholder="Description"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={productForm.image}
            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Add Product
          </button>
        </form>
      </div>
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <input
          type="text"
          placeholder="Search products..."
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
        {filteredProducts.map((p) => (
          <div
            key={p._id}
            style={{
              background: "#222",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <p style={{ fontSize: "14px", color: "#aaa" }}>{p.description}</p>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handleDeleteProduct(p._id)}
                style={{ ...buttonStyle, background: "#fdfdfdff", marginRight: "10px" }}
              >
                Delete
              </button>
              <button
                onClick={() => setEditingProduct(p)}
                style={{ ...buttonStyle, background: "#ffffffff" }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div style={dialogStyle}>
          <div style={dialogBoxStyle}>
            <h2>Edit Product</h2>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              style={inputStyle}
            />
            <select
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              style={inputStyle}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
            <textarea
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
            <input
              type="text"
              value={editingProduct.image}
              onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
              style={inputStyle}
              placeholder="Image URL"
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={handleUpdateProduct} style={buttonStyle}>
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ ...buttonStyle, background: "#6c757d" }}
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
  maxWidth: "600px",
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
};
const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  background: "#ffffffff",
  color: "#000000ff",
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

export default AdminProducts;
