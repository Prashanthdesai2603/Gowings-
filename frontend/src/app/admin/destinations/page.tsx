"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import Link from "next/link";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/destinations");
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/destinations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDestinations();
      } else {
        const errorData = await res.json();
        alert(`Failed to delete destination: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting destination");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Manage Destinations</h1>
        <Link href="/admin/destinations/new" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition">
          <Plus size={20} /> Add New Destination
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm bg-white">
              <th className="py-4 px-6 font-medium">Destination</th>
              <th className="py-4 px-6 font-medium">Country</th>
              <th className="py-4 px-6 font-medium">Linked Trips</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-500">Loading destinations...</td></tr>
            ) : destinations.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-500">No destinations found.</td></tr>
            ) : destinations.map((dest) => (
              <tr key={dest.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <img src={dest.image || dest.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"} alt={dest.name} className="w-12 h-12 rounded object-cover bg-slate-200" />
                    <div>
                      <p className="font-bold text-slate-800">{dest.name}</p>
                      <p className="text-xs text-slate-500">/{dest.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-accent" /> {dest.country}</span>
                </td>
                <td className="py-4 px-6 text-slate-800 font-bold">{dest._count?.trips || 0}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/destinations/${dest.id}/edit`} className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-primary/10 hover:text-primary transition" title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(dest.id)} className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-red-100 hover:text-red-600 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 bg-white text-slate-500 text-sm flex justify-between items-center">
          <span>Showing {destinations.length > 0 ? 1 : 0} to {destinations.length} of {destinations.length} entries</span>
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
