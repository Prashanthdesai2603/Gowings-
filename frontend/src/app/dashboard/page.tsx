"use client";

import { useState, useEffect } from "react";
import { User, PlaneTakeoff, Settings, LogOut, CheckCircle, Clock, Plane, Calendar, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [user, setUser] = useState<any>(null);
  
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const [userRes, bookingsRes, customTripsRes, inquiriesRes] = await Promise.all([
          fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/api/bookings/my-bookings", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/api/custom-trips/my-requests", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/api/contact/my-requests", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (userRes.ok && bookingsRes.ok) {
          const userData = await userRes.json();
          const bookingsData = await bookingsRes.json();
          const customTripsData = customTripsRes.ok ? await customTripsRes.json() : { requests: [] };
          const inquiriesData = inquiriesRes.ok ? await inquiriesRes.json() : { requests: [] };
          
          setUser({ ...userData, bookings: bookingsData, customTrips: customTripsData.requests || [], inquiries: inquiriesData.requests || [] });
          setEditName(userData.name || "");
          setEditPhone(userData.phone || "");
        } else {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchUserAndBookings();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, phone: editPhone })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert("Profile updated successfully!");
      } else {
        const error = await res.json();
        alert(`Failed to update: ${error.message}`);
      }
    } catch (error) {
      alert("Server error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.ok) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.json();
        alert(`Failed to update password: ${error.message}`);
      }
    } catch (error) {
      alert("Server error occurred");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 flex justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="text-center mb-8 pb-6 border-b border-gray-100">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">
              {getInitials(user.name)}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === "bookings" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <PlaneTakeoff size={20} /> My Bookings
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === "profile" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <User size={20} /> Profile Settings
            </button>
            <button 
              onClick={() => setActiveTab("custom-trips")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === "custom-trips" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Plane size={20} /> Custom Trips
            </button>
            <button 
              onClick={() => setActiveTab("inquiries")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === "inquiries" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <MessageSquare size={20} /> My Inquiries
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === "settings" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Settings size={20} /> Account Security
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors font-medium text-red-500 hover:bg-red-50 mt-4">
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "bookings" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">My Bookings</h2>
              
              {user.bookings?.length > 0 ? (
                user.bookings.map((booking: any) => (
                  <div key={booking.id} className="border border-gray-100 rounded-xl p-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        <img src={booking.trip?.images?.[0] || booking.trip?.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200"} alt={booking.trip?.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {booking.status === 'CONFIRMED' ? <CheckCircle size={12} /> : <Clock size={12} />} 
                            {booking.status}
                          </span>
                          <span className="text-gray-500 text-sm">Booking ID: #{booking.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{booking.trip?.title || "Unknown Trip"}</h3>
                        <p className="text-gray-500 text-sm mt-1">{booking.travelerDetails?.length || 1} Guests</p>
                      </div>
                    </div>
                    <div className="text-right w-full md:w-auto">
                      <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
                      <button className="mt-2 text-primary text-sm font-semibold hover:underline">View Details</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <PlaneTakeoff size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">You haven't booked any trips with us yet.</p>
                  <button onClick={() => router.push('/packages')} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition">
                    Explore Packages
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "custom-trips" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">My Custom Trip Requests</h2>
              
              {user.customTrips?.length > 0 ? (
                <div className="space-y-6">
                  {user.customTrips.map((trip: any) => (
                    <div key={trip.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${trip.status === 'PROPOSED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {trip.status}
                            </span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(trip.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">{trip.destination}</h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-gray-500 font-medium text-xs mb-1">Travelers</div>
                          <div className="font-semibold text-gray-800">{trip.travelers}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-gray-500 font-medium text-xs mb-1">Duration</div>
                          <div className="font-semibold text-gray-800">{trip.dates}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-gray-500 font-medium text-xs mb-1">Budget</div>
                          <div className="font-semibold text-gray-800">{trip.budget ? `₹${trip.budget}` : 'N/A'}</div>
                        </div>
                      </div>

                      {trip.responseMessage && (
                        <div className="mt-4 bg-green-50/50 border border-green-100 rounded-xl p-5">
                          <div className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                            <MessageSquare size={18} /> Admin Response
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {trip.responseMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Plane size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No custom trips</h3>
                  <p className="text-gray-500 mb-6">You haven't requested any custom trips yet.</p>
                  <button onClick={() => router.push('/custom-trip')} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition">
                    Request Custom Trip
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "inquiries" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">My Inquiries</h2>
              
              {user.inquiries?.length > 0 ? (
                <div className="space-y-6">
                  {user.inquiries.map((inquiry: any) => (
                    <div key={inquiry.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${inquiry.status === 'RESPONDED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {inquiry.status || 'PENDING'}
                            </span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed mb-4">
                        {inquiry.message}
                      </div>

                      {inquiry.responseMessage && (
                        <div className="mt-4 bg-green-50/50 border border-green-100 rounded-xl p-5">
                          <div className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                            <MessageSquare size={18} /> Admin Reply
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {inquiry.responseMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No inquiries</h3>
                  <p className="text-gray-500 mb-6">You haven't sent any inquiries yet.</p>
                  <button onClick={() => router.push('/contact')} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition">
                    Contact Us
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Profile Settings</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" value={user.email} disabled className="w-full border bg-gray-50 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
                <button type="submit" disabled={isUpdating} className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition disabled:opacity-70">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Account Security</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <button type="submit" disabled={isUpdatingPassword} className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition disabled:opacity-70">
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
