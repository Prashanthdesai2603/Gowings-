"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User as UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if regular user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]); // Re-run effect on pathname change if needed

  // Transparent navbar only on home page and package details page
  const isTransparentRoute = pathname === "/" || pathname.match(/^\/packages\/[^\/]+$/);
  const navClasses = isScrolled || !isTransparentRoute 
    ? "bg-white text-slate-800 shadow-md py-3" 
    : "bg-transparent text-white py-5";

  const textColorClass = isScrolled || !isTransparentRoute ? "text-slate-800 hover:text-primary" : "text-white hover:text-accent";
  const logoColorClass = isScrolled || !isTransparentRoute ? "text-primary" : "text-accent";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Gowings Logo" className="h-14 md:h-16 w-auto object-contain rounded-md" />
        </Link>
        
        {/* Desktop Nav */}
        <nav className={`hidden md:flex gap-8 font-medium ${textColorClass}`}>
          <Link href="/" className="transition">Home</Link>
          <Link href="/about" className="transition">About Us</Link>
          <Link href="/packages" className="transition">Packages</Link>
          <Link href="/destinations" className="transition">Destinations</Link>
          <Link href="/contact" className="transition">Contact</Link>
        </nav>
        
        <div className="hidden md:flex gap-4 items-center">
          {isLoggedIn ? (
            <Link href="/dashboard" className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition font-medium flex items-center gap-2">
              <UserIcon size={18} /> Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className={`transition font-medium ${textColorClass}`}>Login</Link>
              <Link href="/auth/register" className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition font-medium border border-transparent">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white text-slate-800 shadow-lg flex flex-col py-4 px-6 gap-4 border-t">
          <Link href="/" className="hover:text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" className="hover:text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link href="/packages" className="hover:text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>Packages</Link>
          <Link href="/destinations" className="hover:text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>Destinations</Link>
          <Link href="/contact" className="hover:text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-slate-100">
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-center py-2 bg-primary text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-center py-2 border rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link href="/auth/register" className="text-center py-2 bg-primary text-white rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
