"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, PlaneTakeoff, CreditCard } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const stats = [
    { title: "Total Bookings", value: data?.totalBookings || 0, change: "+0%", icon: PlaneTakeoff, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Revenue", value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`, change: "+0%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Customers", value: data?.totalCustomers || 0, change: "+0%", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Pending Payments", value: data?.pendingPaymentsCount || 0, change: "0%", icon: CreditCard, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-slate-500 font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              <p className={`text-sm mt-2 font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings and Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Recent Bookings</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Trip</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data?.recentBookings && data.recentBookings.length > 0 ? (
                  data.recentBookings.map((booking: any) => (
                    <tr key={booking.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-4 text-slate-800 font-medium">{booking.user?.name || "Unknown"}</td>
                      <td className="py-4 text-slate-600">{booking.trip?.title || "Unknown Trip"}</td>
                      <td className="py-4 text-slate-800 font-bold">₹{booking.totalAmount?.toLocaleString('en-IN') || 0}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-700' 
                            : booking.status === 'PENDING' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-500">No recent bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Payment Verifications</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {data?.recentPayments && data.recentPayments.length > 0 ? (
              data.recentPayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{payment.method?.replace('_', ' ') || 'Payment'} - ₹{payment.amount?.toLocaleString('en-IN') || 0}</h4>
                      <p className="text-xs text-slate-500">Booking #{payment.booking?.id?.substring(0, 8)} • Pending</p>
                    </div>
                  </div>
                  <button className="bg-white border border-slate-200 px-3 py-1.5 rounded text-sm font-semibold hover:bg-slate-100 text-slate-700">Review</button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500">No pending payments.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
