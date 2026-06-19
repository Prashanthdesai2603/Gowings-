"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, Phone, Calendar } from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:5000/api/contact", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setInquiries(data.contacts || []);
        }
      } catch (error) {
        console.error("Failed to fetch inquiries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Customer Inquiries</h1>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600">
          Total Inquiries: <span className="text-primary">{inquiries.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {inquiries.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {inquiries.map((inquiry: any) => (
              <div key={inquiry.id} className="p-6 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{inquiry.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <div className="flex items-center gap-1"><Mail size={14} /> {inquiry.email}</div>
                      {inquiry.phone && <div className="flex items-center gap-1"><Phone size={14} /> {inquiry.phone}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={14} /> 
                    {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {inquiry.message}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <MessageSquare size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Inquiries Yet</h3>
            <p>You haven't received any contact messages from customers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
