import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-gray-900 text-white shadow-md px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-blue-300">Inventory Management</h1>
        <nav className="flex items-center gap-3">
          <Link to="/" className="px-3 py-1.5 rounded hover:bg-gray-800">Dashboard</Link>
          <Link to="/products" className="px-3 py-1.5 rounded hover:bg-gray-800">Products</Link>
          <Link to="/sales" className="px-3 py-1.5 rounded hover:bg-gray-800">Sales</Link>
        </nav>
      </div>
    </header>
  );
}
