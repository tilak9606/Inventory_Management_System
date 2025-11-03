import { useEffect, useState } from "react";
import api from "../api.js";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ product_id: "", quantity: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error'|'success', text }

  const load = () => {
    Promise.all([api.get("/products"), api.get("/sales")]).then(([p, s]) => {
      setProducts(p.data);
      setSales(s.data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const mapServerError = (err) => {
    const status = err?.response?.status;
    const raw = err?.response?.data?.error || err?.message || "Unexpected error";
    if (status === 400) return `${raw} (HTTP 400)`;
    if (status === 404) return `Product not found (HTTP 404)`;
    if (status === 500) return `Server error. Please try again. (HTTP 500)`;
    return String(raw);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const payload = { product_id: form.product_id, quantity: Number(form.quantity || 0) };
      if (!payload.product_id) throw new Error("Please select a product");
      if (!Number.isFinite(payload.quantity) || payload.quantity <= 0) throw new Error("Quantity must be 1 or more");
      setSubmitting(true);
      api
        .post("/sales", payload)
        .then(() => {
          setForm({ product_id: "", quantity: "" });
          setMessage({ type: "success", text: "Sale recorded" });
          load();
        })
        .catch((err) => setMessage({ type: "error", text: mapServerError(err) }))
        .finally(() => setSubmitting(false));
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-5 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">Sales</h2>
        <p className="text-gray-300">Record transactions and review recent sales</p>
      </div>

      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-sm ring-1 ring-gray-700 rounded-xl p-4 sm:p-5 w-full max-w-md space-y-4">
          {message && (
            <div className={`${message.type === "error" ? "bg-red-900/30 text-red-200 border-red-500/30" : "bg-green-900/30 text-green-200 border-green-500/30"} border rounded px-3 py-2`}>
              {message.text}
            </div>
          )}

          <div>
            <label htmlFor="product_id" className="block font-medium mb-2">Product</label>
            <select
              id="product_id"
              name="product_id"
              className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-300"
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              required
            >
              <option value="" disabled>
                Select Product
              </option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.quantity} left)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block font-medium mb-2">Quantity</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              min="1"
              placeholder="QUANTITY"
              className="border border-gray-700 rounded-md w-full px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-300"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 rounded-md text-white ${submitting ? "bg-blue-900 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-700">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Recent Sales</h3>
        </div>
        <div className="p-4 sm:p-5">
          {sales.length === 0 ? (
            <p className="text-gray-300">No sales yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/40 text-gray-200">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Unit</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sales.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-900/30">
                      <td className="p-3">{s.product?.name || "Unknown"}</td>
                      <td className="p-3 text-right">{s.quantity}</td>
                      <td className="p-3 text-right">₹{Number(s.unit_price).toFixed(2)}</td>
                      <td className="p-3 text-right">₹{Number(s.total_amount).toFixed(2)}</td>
                      <td className="p-3 text-right">{new Date(s.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
