"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User as UserIcon, ChevronDown, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparentRoute = pathname === "/" || pathname.match(/^\/packages\/[^\/]+$/) || pathname.match(/^\/trekking\/[^\/]+$/);
  
  const navClasses = isScrolled || !isTransparentRoute 
    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-2" 
    : "bg-transparent py-4";

  const textColorClass = isScrolled || !isTransparentRoute ? "text-slate-700" : "text-white";

  const navLinks = [
    { name: "Home", path: "/" },
    { 
      name: "Destinations", 
      path: "/destinations"
    },
    { 
      name: "Categories", 
      path: "#",
      dropdown: [
        { name: "Packages", path: "/packages" },
        { name: "Trekking", path: "/trekking" },
        { name: "Custom Trips", path: "/custom-trip" }
      ]
    },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${navClasses}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <img src="/LOGO.png" alt="Gowings Logo" className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105" />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group px-3 py-2"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={link.path} 
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${textColorClass} hover:text-primary ${pathname === link.path ? 'text-primary' : ''}`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                </Link>
                
                {/* Dropdown Menu */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                      >
                        {link.dropdown.map((item) => (
                          <Link 
                            key={item.name} 
                            href={item.path}
                            className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors font-semibold text-sm flex items-center gap-2">
                <UserIcon size={16} /> Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className={`px-4 py-2 text-sm font-semibold transition-colors ${textColorClass} hover:text-primary`}>Login</Link>
                <Link href="/auth/register" className="px-5 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-full hover:bg-primary hover:text-white transition-colors">Register</Link>
              </div>
            )}
            <Link href="/packages" className="px-6 py-2.5 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`lg:hidden p-2 z-50 rounded-full transition-colors ${isMobileMenuOpen ? 'text-gray-800' : textColorClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="mt-12 flex flex-col gap-1 flex-grow">
                  {navLinks.map((link, i) => (
                    <motion.div 
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.1 }}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <Link 
                        href={link.path} 
                        onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                        className={`block py-4 text-lg font-bold ${pathname === link.path ? 'text-primary' : 'text-gray-800'}`}
                      >
                        {link.name}
                      </Link>
                      {link.dropdown && (
                        <div className="pl-4 pb-4 flex flex-col gap-3">
                          {link.dropdown.map(item => (
                            <Link 
                              key={item.name} 
                              href={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-gray-500 font-medium hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <PhoneCall size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Call us anytime</p>
                      <p className="font-bold text-gray-800">+91 98765 43210</p>
                    </div>
                  </div>

                  {isLoggedIn ? (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3.5 bg-gray-100 text-gray-800 rounded-xl font-bold text-center">
                      My Dashboard
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-center">
                        Login
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="py-3.5 bg-primary/10 text-primary rounded-xl font-bold text-center">
                        Register
                      </Link>
                    </div>
                  )}
                  <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-center text-lg shadow-lg">
                    Book Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
