"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, PlaneTakeoff, CreditCard, ChevronRight, Search, Filter, MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
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
    { title: "Total Bookings", value: data?.totalBookings || 0, change: "+12.5%", icon: PlaneTakeoff, color: "text-blue-600", bg: "bg-blue-50 border-blue-100", chart: "M0 20 Q 10 10 20 20 T 40 10 T 60 20 T 80 5 T 100 15" },
    { title: "Total Revenue", value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`, change: "+8.2%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", chart: "M0 30 Q 10 20 20 30 T 40 10 T 60 15 T 80 5 T 100 10" },
    { title: "Total Customers", value: data?.totalCustomers || 0, change: "+15.3%", icon: Users, color: "text-purple-600", bg: "bg-purple-50 border-purple-100", chart: "M0 10 Q 10 20 20 10 T 40 15 T 60 5 T 80 15 T 100 5" },
    { title: "Pending Payments", value: data?.pendingPaymentsCount || 0, change: "-2.4%", icon: CreditCard, color: "text-orange-600", bg: "bg-orange-50 border-orange-100", chart: "M0 15 Q 10 5 20 15 T 40 5 T 60 20 T 80 10 T 100 5" },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen -m-6 p-6">
      <SlideUp className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
            Download Report
          </button>
        </div>
      </SlideUp>
      
      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StaggerItem key={i} className="h-full">
            <div className={`bg-white rounded-3xl p-6 shadow-sm border ${stat.bg} hover:shadow-md transition-shadow relative overflow-hidden h-full flex flex-col`}>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {stat.change}
                </span>
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mt-1">{stat.title}</p>
              </div>

              {/* Decorative mini chart in background */}
              <div className="absolute bottom-0 right-0 left-0 h-16 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                  <path d={stat.chart} fill="none" stroke="currentColor" strokeWidth="2" className={stat.color} />
                </svg>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Recent Bookings and Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Bookings Table */}
        <SlideUp delay={0.3} className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-extrabold text-slate-800">Recent Bookings</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search bookings..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-64 transition-all" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Customer</th>
                    <th className="px-6 py-4 font-bold">Trip Package</th>
                    <th className="px-6 py-4 font-bold">Amount</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {data?.recentBookings && data.recentBookings.length > 0 ? (
                    data.recentBookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                              {(booking.user?.name || "U")[0]}
                            </div>
                            <span className="text-slate-800 font-bold">{booking.user?.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-slate-600 font-medium line-clamp-1">{booking.trip?.title || "Unknown Trip"}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-slate-800 font-black">₹{booking.totalAmount?.toLocaleString('en-IN') || 0}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                              : booking.status === 'PENDING' 
                                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                                : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? <CheckCircle size={12} /> : 
                             booking.status === 'PENDING' ? <Clock size={12} /> : <XCircle size={12} />}
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="py-12 text-center text-slate-500 font-medium">No recent bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {data?.recentBookings && data.recentBookings.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto flex justify-center">
                <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  View all bookings <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </SlideUp>

        {/* Action Required / Payments */}
        <SlideUp delay={0.4} className="xl:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-rose-400"></div>
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">Action Required</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Pending Verifications</p>
              </div>
              <div className="bg-orange-100 text-orange-600 font-black px-3 py-1 rounded-full text-sm">
                {data?.recentPayments?.length || 0}
              </div>
            </div>
            
            <div className="p-6 flex-grow space-y-4">
              {data?.recentPayments && data.recentPayments.length > 0 ? (
                data.recentPayments.map((payment: any, index: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    key={payment.id} 
                    className="flex flex-col p-4 border border-slate-100 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-orange-200 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold tracking-wider uppercase mb-0.5">Booking #{payment.booking?.id?.substring(0, 6)}</p>
                          <h4 className="font-extrabold text-slate-800 text-sm">{payment.method?.replace('_', ' ') || 'Payment'}</h4>
                        </div>
                      </div>
                      <span className="font-black text-slate-800">₹{payment.amount?.toLocaleString('en-IN') || 0}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 bg-slate-800 text-white py-2 rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors">
                        Review Proof
                      </button>
                      <button className="flex-1 bg-emerald-50 text-emerald-600 border border-emerald-100 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">
                        Approve
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">All Caught Up!</h4>
                  <p className="text-sm text-slate-500 font-medium">No pending payments to verify.</p>
                </div>
              )}
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
}
