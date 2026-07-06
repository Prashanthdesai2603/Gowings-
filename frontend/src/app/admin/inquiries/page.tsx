"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, Phone, Calendar, Send, X } from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [respondModal, setRespondModal] = useState({ isOpen: false, reqId: "", email: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendResponse = async () => {
    if (!responseMsg.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${respondModal.reqId}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: responseMsg })
      });
      if (res.ok) {
        setInquiries(inquiries.map(r => r.id === respondModal.reqId ? { ...r, status: "RESPONDED" } : r));
        setRespondModal({ isOpen: false, reqId: "", email: "" });
        setResponseMsg("");
      } else {
        alert("Failed to send response");
      }
    } catch (e) {
      console.error("Error sending response", e);
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
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
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar size={14} /> 
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${inquiry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {inquiry.status || 'PENDING'}
                      </span>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed mb-4">
                  {inquiry.message}
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setRespondModal({ isOpen: true, reqId: inquiry.id, email: inquiry.email })}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                  >
                    <Send size={16} /> Send Reply
                  </button>
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

      {/* Respond Modal */}
      {respondModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Send Reply</h3>
              <button 
                onClick={() => setRespondModal({ isOpen: false, reqId: "", email: "" })}
                className="p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium text-slate-600 mb-1">To:</div>
              <div className="text-sm text-slate-800 font-mono bg-slate-50 p-2 rounded border border-slate-100">{respondModal.email}</div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea 
                rows={6}
                value={responseMsg}
                onChange={(e) => setResponseMsg(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none text-sm"
                placeholder="Type your reply here..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRespondModal({ isOpen: false, reqId: "", email: "" })}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendResponse}
                disabled={sending || !responseMsg.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {sending ? "Sending..." : <><Send size={18} /> Send Reply</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
