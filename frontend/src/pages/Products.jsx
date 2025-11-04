import { useEffect, useState } from "react";
import api from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    cost_price: "",
    selling_price: "",
    low_stock_threshold: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error'|'success', text: string }

  const loadProducts = () => api.get("/products").then(res => setProducts(res.data));

  useEffect(() => { 
    loadProducts(); 
  }, []);

  const validate = () => {
    const name = form.name.trim();
    const sku = form.sku.trim();
    const quantity = Number(form.quantity);
    const cost = Number(form.cost_price);
    const price = Number(form.selling_price);
    const threshold = form.low_stock_threshold === "" ? 5 : Number(form.low_stock_threshold);
    if (!name) return "Name is required";
    if (!sku) return "SKU is required";
    if (!Number.isFinite(quantity) || quantity < 0) return "Quantity must be 0 or more";
    if (!Number.isFinite(cost) || cost < 0) return "Cost price must be 0 or more";
    if (!Number.isFinite(price) || price < 0) return "Selling price must be 0 or more";
    if (!Number.isFinite(threshold) || threshold < 0) return "Low stock threshold must be 0 or more";
    return null;
  };

  const mapServerError = (err) => {
    const status = err?.response?.status;
    const raw = err?.response?.data?.error || err?.message || "Unexpected error";
    if (/E11000/i.test(String(raw))) {
      return `SKU must be unique. Please choose a different SKU.`;
    }
    if (status === 400) return `${raw} (HTTP 400)`;
    if (status === 500) return `Server error. Please try again. (HTTP 500)`;
    return String(raw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const errorText = validate();
    if (errorText) {
      setMessage({ type: "error", text: errorText });
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      quantity: Number(form.quantity || 0),
      cost_price: Number(form.cost_price || 0),
      selling_price: Number(form.selling_price || 0),
      low_stock_threshold: form.low_stock_threshold === "" ? 5 : Number(form.low_stock_threshold),
    };

    try {
      setSubmitting(true);
      await api.post("/products", payload);
      await loadProducts();
      setForm({ name: "", sku: "", category: "", quantity: "", cost_price: "", selling_price: "", low_stock_threshold: "" });
      setMessage({ type: "success", text: "Product added" });
    } catch (err) {
      setMessage({ type: "error", text: mapServerError(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const doDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    await loadProducts();
  };

  const doEdit = async (p) => {
    const name = prompt("Name", p.name);
    if (name === null) return;
    const sku = prompt("SKU", p.sku);
    if (sku === null) return;
    const category = prompt("Category", p.category || "");
    if (category === null) return;
    const quantity = Number(prompt("Quantity", String(p.quantity)) ?? p.quantity);
    const cost_price = Number(prompt("Cost Price", String(p.cost_price)) ?? p.cost_price);
    const selling_price = Number(prompt("Selling Price", String(p.selling_price)) ?? p.selling_price);
    const low_stock_threshold = Number(prompt("Low Stock Threshold", String(p.low_stock_threshold ?? 5)) ?? (p.low_stock_threshold ?? 5));
    await api.put(`/products/${p._id}`, { name, sku, category, quantity, cost_price, selling_price, low_stock_threshold });
    await loadProducts();
  };

  const doAddStock = async (p) => {
    const amount = Number(prompt("Add amount", "1"));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const reason = prompt("Reason", "restock") || "restock";
    await api.post(`/products/${p._id}/add-stock`, { amount, reason });
    await loadProducts();
  };

  const doRemoveStock = async (p) => {
    const amount = Number(prompt("Remove amount", "1"));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const reason = prompt("Reason", "adjustment") || "adjustment";
    const resp = await api.post(`/products/${p._id}/remove-stock`, { amount, reason }).catch((e) => {
      alert(e?.response?.data?.message || e.message);
    });
    if (resp) await loadProducts();
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-5 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">Products</h2>
        <p className="text-gray-300">Manage your inventory</p>
      </div>

      {message && (
        <div className={`${message.type === "error" ? "bg-red-900/30 text-red-200 border-red-500/30" : "bg-green-900/30 text-green-200 border-green-500/30"} border rounded px-3 py-2`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-sm ring-1 ring-gray-700 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input id="name" type="text" name="name" placeholder="NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div>
          <label htmlFor="sku" className="block text-sm font-medium mb-1">SKU</label>
          <input id="sku" type="text" name="sku" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <input id="category" type="text" name="category" placeholder="CATEGORY" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
          <input id="quantity" type="number" name="quantity" placeholder="QUANTITY" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div>
          <label htmlFor="cost_price" className="block text-sm font-medium mb-1">Cost Price</label>
          <input id="cost_price" type="number" name="cost_price" placeholder="COST PRICE" min="0" step="0.01" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div>
          <label htmlFor="selling_price" className="block text-sm font-medium mb-1">Selling Price</label>
          <input id="selling_price" type="number" name="selling_price" placeholder="SELLING PRICE" min="0" step="0.01" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="low_stock_threshold" className="block text-sm font-medium mb-1">Low Stock Threshold</label>
          <input id="low_stock_threshold" type="number" name="low_stock_threshold" placeholder="LOW STOCK THRESHOLD (default 5)" min="0" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300" />
        </div>
        <button type="submit" disabled={submitting} className={`py-2 rounded-md sm:col-span-2 w-full text-white ${submitting ? "bg-blue-900 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>{submitting ? "Adding..." : "Add Product"}</button>
      </form>

      <div className="bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Product List</h3>
          <span className="text-sm text-gray-300">{products.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/40 text-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Cost</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Profit/Unit</th>
                <th className="p-3 text-right">Margin%</th>
                <th className="p-3 text-right">Threshold</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-900/30">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.category || "-"}</td>
                  <td className="p-3 text-right">{p.quantity}</td>
                  <td className="p-3 text-right">₹{p.cost_price}</td>
                  <td className="p-3 text-right">₹{p.selling_price}</td>
                  <td className="p-3 text-right">₹{Number(p.selling_price - p.cost_price).toFixed(2)}</td>
                  <td className="p-3 text-right">{Number(p.selling_price ? ((p.selling_price - p.cost_price) / p.selling_price) * 100 : 0).toFixed(2)}%</td>
                  <td className="p-3 text-right">{p.low_stock_threshold ?? 5}</td>
                  <td className="p-3 text-right">
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button onClick={() => doEdit(p)} className="px-2 py-1 rounded border border-gray-600 hover:bg-gray-700">Edit</button>
                      <button onClick={() => doAddStock(p)} className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700">+Stock</button>
                      <button onClick={() => doRemoveStock(p)} className="px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600">-Stock</button>
                      <button onClick={() => doDelete(p._id)} className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
