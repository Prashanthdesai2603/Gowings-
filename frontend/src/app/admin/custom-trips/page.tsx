"use client";

import { useEffect, useState } from "react";
import { Plane, Mail, Phone, Calendar, Users, MapPin, IndianRupee, Send, X } from "lucide-react";

export default function AdminCustomTripsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [respondModal, setRespondModal] = useState({ isOpen: false, reqId: "", email: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendResponse = async () => {
    if (!responseMsg.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom-trips/${respondModal.reqId}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: responseMsg })
      });
      if (res.ok) {
        setRequests(requests.map(r => r.id === respondModal.reqId ? { ...r, status: "PROPOSED" } : r));
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
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom-trips`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error("Failed to fetch custom trip requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Custom Trip Requests</h1>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600">
          Total Requests: <span className="text-primary">{requests.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {requests.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {requests.map((req: any) => (
              <div key={req.id} className="p-6 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{req.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <div className="flex items-center gap-1"><Mail size={14} /> {req.email}</div>
                      {req.phone && <div className="flex items-center gap-1"><Phone size={14} /> {req.phone}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={14} /> 
                      {new Date(req.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-blue-500 font-medium uppercase">Destination</div>
                      <div className="font-semibold text-blue-900">{req.destination}</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-green-500 font-medium uppercase">Travelers</div>
                      <div className="font-semibold text-green-900">{req.travelers}</div>
                    </div>
                  </div>

                  {req.dates && (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <div className="text-xs text-purple-500 font-medium uppercase">Dates/Duration</div>
                        <div className="font-semibold text-purple-900">{req.dates}</div>
                      </div>
                    </div>
                  )}

                  {req.budget && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <IndianRupee size={16} />
                      </div>
                      <div>
                        <div className="text-xs text-orange-500 font-medium uppercase">Budget (Per Person)</div>
                        <div className="font-semibold text-orange-900">₹{req.budget}</div>
                      </div>
                    </div>
                  )}
                </div>

                {req.requirements && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed mb-4">
                    <div className="font-semibold text-slate-800 mb-1">Additional Requirements:</div>
                    {req.requirements}
                  </div>
                )}

                <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setRespondModal({ isOpen: true, reqId: req.id, email: req.email })}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                  >
                    <Send size={16} /> Send Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <Plane size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Custom Trip Requests</h3>
            <p>You haven't received any custom trip requests from customers yet.</p>
          </div>
        )}
      </div>

      {/* Respond Modal */}
      {respondModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Send Response</h3>
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
                placeholder="Type your response here... (Note: this currently simulates sending an email and updates the status to PROPOSED)"
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
                {sending ? "Sending..." : <><Send size={18} /> Send Message</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
