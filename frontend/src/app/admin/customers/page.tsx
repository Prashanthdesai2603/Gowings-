"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, Calendar } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/customers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm bg-white">
              <th className="py-4 px-6 font-medium">Name</th>
              <th className="py-4 px-6 font-medium">Contact</th>
              <th className="py-4 px-6 font-medium">Joined Date</th>
              <th className="py-4 px-6 font-medium">Total Bookings</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-500">Loading customers...</td></tr>
            ) : filteredCustomers.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-500">No customers found.</td></tr>
            ) : filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {customer.name?.charAt(0) || "U"}
                    </div>
                    <span className="font-bold text-slate-800">{customer.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-slate-600"><Mail size={14}/> {customer.email}</span>
                    {customer.phone && <span className="flex items-center gap-2 text-slate-600"><Phone size={14}/> {customer.phone}</span>}
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">
                  <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(customer.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-semibold">{customer._count?.bookings || 0}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
