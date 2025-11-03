import { useEffect, useState } from "react";
import api from "../api.js";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get("/dashboard/overview"),
      api.get("/products/low-stock"),
    ])
      .then(([overview, low]) => {
        setData(overview.data);
        setLowStock(low.data);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
        const serverMsg = err?.response?.data?.error || err?.message || "Failed to load dashboard data";
        setError(serverMsg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="px-6 py-4">Loading...</p>;
  if (error)
    return (
      <div className="px-6 py-4 space-y-3">
        <div className="border border-red-500/30 bg-red-900/30 text-red-200 rounded px-3 py-2">{error}</div>
        <button onClick={load} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
      </div>
    );

  const totalInventoryValue = Number(data?.totalInventoryValue || 0);
  const lowStockCount = Number(data?.lowStockCount || 0);
  const totalSales = Number(data?.totalSales || 0);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-5 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-gray-300">Overview of inventory and sales</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-700 p-4 sm:p-5">
          <p className="text-gray-300">Total Inventory Value</p>
          <p className="mt-1 text-3xl font-bold text-blue-300">₹{totalInventoryValue.toFixed(2)}</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-700 p-4 sm:p-5">
          <p className="text-gray-300">Low Stock Products</p>
          <p className="mt-1 text-3xl font-bold text-yellow-300">{lowStockCount}</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-700 p-4 sm:p-5">
          <p className="text-gray-300">Total Sales</p>
          <p className="mt-1 text-3xl font-bold text-green-300">₹{totalSales.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-700">
        <div className="p-4 sm:p-5 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
          <p className="text-gray-300 text-sm">Products at or below their threshold</p>
        </div>
        <div className="p-4 sm:p-5">
          {lowStock.length === 0 ? (
            <p className="text-gray-300">All good! No low stock items.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/40 text-gray-200">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {lowStock.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-900/30">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3 text-right">{p.quantity}</td>
                      <td className="p-3 text-right">{p.low_stock_threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-700">
        <div className="p-4 sm:p-5 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Top 5 Products</h3>
          <p className="text-gray-300 text-sm">By total units sold</p>
        </div>
        <div className="p-4 sm:p-5">
          {(!data?.topSelling || data.topSelling.length === 0) ? (
            <p className="text-gray-300">No sales data yet</p>
          ) : (
            <ul className="space-y-2">
              {data.topSelling.map((t) => {
                const name = t.productInfo?.[0]?.name || "Unknown";
                return (
                  <li key={t._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-900/30 rounded px-3 py-2 gap-1">
                    <span>{name}</span>
                    <span className="text-gray-300">{t.totalSold} sold</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalSales: 0,
//     totalRevenue: 0,
//     recentSales: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const API = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     fetch(`${API}/api/dashboard`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStats(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to load dashboard:", err);
//         setLoading(false);
//       });
//   }, [API]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen text-lg font-semibold">
//         Loading Dashboard...
//       </div>
//     );

//   return (
//     <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       <h1 className="text-3xl font-bold mb-6 text-center">📊 Dashboard</h1>

//       {/* Stats cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//         <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-center">
//           <p className="text-gray-500 text-sm">Total Products</p>
//           <h2 className="text-3xl font-bold">{stats.totalProducts}</h2>
//         </div>
//         <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-center">
//           <p className="text-gray-500 text-sm">Total Sales</p>
//           <h2 className="text-3xl font-bold">{stats.totalSales}</h2>
//         </div>
//         <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-center">
//           <p className="text-gray-500 text-sm">Total Revenue</p>
//           <h2 className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</h2>
//         </div>
//       </div>

//       {/* Recent Sales Table */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
//         <h2 className="text-2xl font-semibold mb-4">Recent Sales</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm text-left">
//             <thead>
//               <tr className="border-b border-gray-300 dark:border-gray-700">
//                 <th className="p-3">Product</th>
//                 <th className="p-3">Quantity</th>
//                 <th className="p-3">Total Price</th>
//                 <th className="p-3">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.recentSales.length > 0 ? (
//                 stats.recentSales.map((sale) => (
//                   <tr
//                     key={sale._id}
//                     className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
//                   >
//                     <td className="p-3">{sale.product?.name || "Unknown"}</td>
//                     <td className="p-3">{sale.quantity}</td>
//                     <td className="p-3">₹{sale.totalPrice.toFixed(2)}</td>
//                     <td className="p-3">
//                       {new Date(sale.createdAt).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="p-3 text-center text-gray-500">
//                     No sales yet
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
