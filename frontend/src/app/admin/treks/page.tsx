"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

export default function AdminTreksPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/treks`);
      if (res.ok) {
        const responseData = await res.json();
        let extractedPackages: any[] = [];
        if (responseData && Array.isArray(responseData.data)) {
          extractedPackages = responseData.data;
        } else if (Array.isArray(responseData)) {
          extractedPackages = responseData;
        }
        const parsedPackages = extractedPackages.map(pkg => {
          if (typeof pkg.images === 'string') {
            try { pkg.images = JSON.parse(pkg.images); } catch { pkg.images = []; }
          }
          return pkg;
        });
        setPackages(parsedPackages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error("Failed to fetch treks:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trek?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/treks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTreks();
      } else {
        alert("Failed to delete trek");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting trek");
    }
  };

  const safePackages = Array.isArray(packages) ? packages : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Manage Treks</h1>
        <Link href="/admin/treks/new" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition">
          <Plus size={20} /> Add New Trek
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search treks..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm bg-white">
              <th className="py-4 px-6 font-medium">Trek Name</th>
              <th className="py-4 px-6 font-medium">Location</th>
              <th className="py-4 px-6 font-medium">Difficulty</th>
              <th className="py-4 px-6 font-medium">Price</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-slate-500">Loading treks...</td></tr>
            ) : safePackages.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-slate-500">No treks found.</td></tr>
            ) : safePackages.map((pkg) => (
              <tr key={pkg.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <img src={pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"} alt={pkg.title} className="w-12 h-12 rounded object-cover bg-slate-200" />
                    <div>
                      <p className="font-bold text-slate-800">{pkg.title}</p>
                      <p className="text-xs text-slate-500">{pkg.duration || "Multi-day"}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">{pkg.destination?.name || "Global"}</td>
                <td className="py-4 px-6 text-slate-600 font-medium">{pkg.difficulty || "Moderate"}</td>
                <td className="py-4 px-6 text-slate-800 font-bold">₹{pkg.price.toLocaleString('en-IN')}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/treks/${pkg.id}/edit`} className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-primary/10 hover:text-primary transition" title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-red-100 hover:text-red-600 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 bg-white text-slate-500 text-sm flex justify-between items-center">
          <span>Showing {safePackages.length > 0 ? 1 : 0} to {safePackages.length} of {safePackages.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border rounded bg-primary text-white">1</button>
            <button className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
