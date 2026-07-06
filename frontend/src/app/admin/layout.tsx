"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Plane, CreditCard, Users, MessageSquare, Settings, LogOut, MapPin } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{name: string, email: string} | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userStr = localStorage.getItem("adminUser");
    
    if (!token || !userStr) {
      router.push("/admin-login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "ADMIN") {
        router.push("/admin-login");
        return;
      }
      setAdminUser(user);
    } catch (e) {
      router.push("/admin-login");
      return;
    }
    
    setIsChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin-login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Trips", href: "/admin/trips", icon: Plane },
    { name: "Manage Destinations", href: "/admin/destinations", icon: MapPin },
    { name: "Verify Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Custom Trips", href: "/admin/custom-trips", icon: Plane },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Company Settings", href: "/admin/settings", icon: Settings },
  ];

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="text-2xl font-bold tracking-wider text-white flex items-center gap-2">
            <span className="text-accent">G</span>owings <span className="text-xs bg-accent text-slate-900 px-2 py-1 rounded ml-2">Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="flex flex-col gap-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors text-red-400 hover:bg-red-400/10 hover:text-red-300 cursor-pointer">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Admin Control Panel</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">Welcome, <span className="font-bold text-slate-800">{adminUser?.name || "Admin"}</span></div>
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/30 uppercase">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
