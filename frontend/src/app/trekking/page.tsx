"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Clock, Filter, Mountain, ArrowRight, Users, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/animations";

export default function TrekkingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(searchTerm && { search: searchTerm }),
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/treks?${queryParams}`);
      if (res.ok) {
        const responseData = await res.json();
        
        let extractedPackages: any[] = [];
        if (responseData && Array.isArray(responseData.data)) {
          extractedPackages = responseData.data;
        } else if (Array.isArray(responseData)) {
          extractedPackages = responseData;
        }
        
        if (difficultyFilter !== "All") {
           extractedPackages = extractedPackages.filter(p => p.difficulty === difficultyFilter);
        }
        
        const parsedPackages = extractedPackages.map(pkg => {
          if (typeof pkg.images === 'string') {
            try { pkg.images = JSON.parse(pkg.images); } catch { pkg.images = []; }
          }
          return pkg;
        });
        
        setPackages(parsedPackages);
        if (responseData && responseData.pagination) setTotalPages(responseData.pagination.totalPages);
      } else setPackages([]);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, [page, difficultyFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchPackages();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const difficulties = ["All", "Easy", "Moderate", "Difficult"];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      {/* Premium Banner */}
      <div 
        className="text-white py-32 mx-4 sm:mx-6 lg:mx-8 mb-12 relative overflow-hidden bg-slate-900 flex items-center justify-center min-h-[350px] rounded-3xl shadow-2xl"
        style={{
          backgroundImage: "url('/images/trekking-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <SlideUp>
             <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-xl text-white">Conquer The Heights</h1>
             <p className="text-xl text-slate-200 max-w-2xl font-medium drop-shadow-md">
               Discover thrilling trekking trails. Escape the ordinary and embrace the adventure.
             </p>
          </SlideUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
        {/* Sticky Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-28">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-8 text-slate-800">
              <Filter size={20} className="text-primary" /> Filter Treks
            </h2>
            
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-500">Search Destinations</h3>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Kudremukh..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl font-medium bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-slate-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-500">Difficulty Level</h3>
              <div className="flex flex-col gap-4">
                {difficulties.map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="difficulty" 
                      value={level}
                      checked={difficultyFilter === level}
                      onChange={() => { setDifficultyFilter(level); setPage(1); }}
                      className="w-5 h-5 text-primary accent-primary focus:ring-primary"
                    />
                    <span className={`font-medium transition-colors ${difficultyFilter === level ? 'text-primary font-bold' : 'text-slate-600 group-hover:text-primary'}`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Packages Grid */}
        <main className="w-full lg:w-3/4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {loading ? "Finding trails..." : "Available Treks"}
              </h2>
              {!loading && <p className="text-slate-500 font-medium mt-1">Showing {packages.length} results</p>}
            </div>
          </div>

          {(() => {
            const safePackages = Array.isArray(packages) ? packages : [];
            return !loading && safePackages.length > 0 ? (
            <>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {safePackages.map((pkg, index) => {
                  const hasDiscount = pkg.discountedPrice && pkg.discountedPrice < pkg.price;
                  const displayPrice = hasDiscount ? pkg.discountedPrice : pkg.price;

                  return (
                    <StaggerItem key={pkg.id} className="h-full">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-slate-100 group flex flex-col h-full transform hover:-translate-y-1">
                        <div className="relative h-64 overflow-hidden shrink-0">
                          <img 
                            src={pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"} 
                            alt={pkg.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Mountain size={14} className="text-primary" /> {pkg.difficulty || "Moderate"}
                          </div>
                          {pkg.isFeatured && (
                             <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                                BESTSELLER
                             </div>
                          )}

                          <div className="absolute bottom-4 left-4 flex gap-2">
                            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/20">
                              <MapPin size={14} /> {pkg.destination?.name || "Karnataka"}
                            </span>
                            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/20">
                              <Clock size={14} /> {pkg.duration || "2D/1N"}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col grow">
                          <h3 className="text-2xl font-extrabold mb-3 text-slate-800 group-hover:text-primary transition-colors line-clamp-1">{pkg.title}</h3>
                          
                          <p className="text-slate-600 line-clamp-2 mb-6 font-medium text-sm grow">{pkg.overview}</p>
                          
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                              <Users size={16} /> Few seats left
                            </div>
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                              <Star size={16} className="fill-accent text-accent" /> 4.9
                            </div>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-5 flex justify-between items-end mt-auto">
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Starting from</p>
                              <div className="flex items-end gap-2">
                                 <p className="text-2xl font-black text-slate-800">₹{displayPrice.toLocaleString('en-IN')}</p>
                                 {hasDiscount && (
                                    <p className="text-sm font-bold text-slate-400 line-through mb-1">₹{pkg.price.toLocaleString('en-IN')}</p>
                                 )}
                              </div>
                            </div>
                            <Link href={`/trekking/${pkg.slug}`} className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2 transform hover:-translate-y-0.5">
                              Explore <ArrowRight size={18} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-3">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    className="px-6 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-slate-600 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30">
                    {page}
                  </span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-6 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-slate-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : !loading ? (
            <FadeIn>
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mountain size={40} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">No treks found</h3>
                <p className="text-slate-500 mb-8 font-medium">We couldn't find any treks matching your current criteria.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setDifficultyFilter("All"); setPage(1);}}
                  className="px-8 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-3xl h-[500px] border border-slate-100 p-2 animate-pulse">
                  <div className="w-full h-64 bg-slate-100 rounded-2xl mb-4"></div>
                  <div className="px-4">
                    <div className="h-8 bg-slate-100 rounded-lg w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-100 rounded-lg w-full mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded-lg w-5/6 mb-8"></div>
                    <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          );
          })()}
        </main>
      </div>
    </div>
  );
}
