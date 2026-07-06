"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchPayments();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const filteredPayments = payments.filter(p => 
    p.booking?.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.booking?.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.booking?.trip?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'VERIFIED': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1 text-xs font-bold w-fit"><CheckCircle size={14}/> Verified</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1 text-xs font-bold w-fit"><XCircle size={14}/> Rejected</span>;
      default: return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1 text-xs font-bold w-fit"><Clock size={14}/> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Verify Payments</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search payments..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm bg-white">
              <th className="py-4 px-6 font-medium">Customer & Trip</th>
              <th className="py-4 px-6 font-medium">Amount</th>
              <th className="py-4 px-6 font-medium">Screenshot</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-slate-500">Loading payments...</td></tr>
            ) : filteredPayments.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-slate-500">No payments found.</td></tr>
            ) : filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                <td className="py-4 px-6">
                  <div className="font-bold text-slate-800">{payment.booking?.user?.name || "Unknown"}</div>
                  <div className="text-xs text-slate-500">{payment.booking?.user?.email}</div>
                  <div className="text-xs text-primary font-medium mt-1">Trip: {payment.booking?.trip?.title}</div>
                  <div className="text-xs text-slate-400">Date: {new Date(payment.createdAt).toLocaleString()}</div>
                </td>
                <td className="py-4 px-6 font-bold text-slate-800">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-6">
                  {payment.screenshotUrl ? (
                    <button 
                      onClick={() => {
                        if (payment.screenshotUrl.startsWith('data:')) {
                          const win = window.open();
                          if (win) {
                            win.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center;background:#000;height:100vh;"><img src="${payment.screenshotUrl}" style="max-width:100%;max-height:100vh;" /></body></html>`);
                          }
                        } else if (payment.screenshotUrl === 'simulated_card_payment') {
                          alert("This was a simulated card payment. No screenshot required.");
                        } else {
                          const url = payment.screenshotUrl.startsWith('http') ? payment.screenshotUrl : `${process.env.NEXT_PUBLIC_API_URL}${payment.screenshotUrl.startsWith('/') ? '' : '/'}${payment.screenshotUrl}`;
                          window.open(url, '_blank');
                        }
                      }}
                      className="text-primary hover:underline text-xs flex items-center gap-1 cursor-pointer"
                    >
                      View Receipt
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs">No screenshot</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="py-4 px-6 text-right">
                  {payment.status === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(payment.id, 'VERIFIED')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs font-bold"
                      >
                        Verify
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(payment.id, 'REJECTED')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
