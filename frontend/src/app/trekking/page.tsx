"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Clock, Filter, Mountain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
        
        // Client-side filter for difficulty since the backend API doesn't have it explicitly yet
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
        
        if (responseData && responseData.pagination) {
          setTotalPages(responseData.pagination.totalPages);
        }
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [page, difficultyFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchPackages();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const difficulties = ["All", "Easy", "Moderate", "Difficult"];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div 
        className="text-white py-24 mb-12 relative overflow-hidden bg-slate-900 flex items-center justify-center min-h-[300px]"
        style={{
          backgroundImage: "url('/images/trekking-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
             <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg text-white">Conquer The Heights</h1>
             <p className="text-xl text-slate-200 max-w-2xl mx-auto font-medium drop-shadow-md">
               Discover thrilling trekking trails. Escape the ordinary and embrace the adventure.
             </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-28">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-800">
              <Filter size={20} className="text-primary" /> Refine Search
            </h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-slate-700">Search Treks</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Kudremukh..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-slate-50 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-slate-700">Difficulty Level</h3>
              <div className="flex flex-col gap-3">
                {difficulties.map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="difficulty" 
                      value={level}
                      checked={difficultyFilter === level}
                      onChange={() => { setDifficultyFilter(level); setPage(1); }}
                      className="w-4 h-4 text-primary accent-primary"
                    />
                    <span className="text-slate-600 group-hover:text-primary font-medium transition">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Packages Grid */}
        <main className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              {loading ? "Discovering trails..." : "Available Treks"}
            </h2>
          </div>

          {(() => {
            const safePackages = Array.isArray(packages) ? packages : [];
            return !loading && safePackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {safePackages.map((pkg, index) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    key={pkg.id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <img 
                        src={pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <Mountain size={14} className="text-primary" /> {pkg.difficulty || "Moderate"}
                      </div>
                      {pkg.isFeatured && (
                         <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            Featured
                         </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col grow">
                      <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-primary transition">{pkg.title}</h3>
                      <div className="flex flex-wrap items-center text-slate-500 mb-4 gap-4 text-sm font-medium">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md"><MapPin size={16} className="text-accent"/> {pkg.destination?.name || "Karnataka"}</span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md"><Clock size={16} className="text-accent"/> {pkg.duration || "2D/1N"}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 mb-6 grow">{pkg.overview}</p>
                      
                      <div className="border-t border-slate-100 pt-5 flex justify-between items-center mt-auto">
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Starting from</p>
                          <div className="flex items-center gap-2">
                             <p className="text-2xl font-black text-primary">₹{pkg.price.toLocaleString('en-IN')}</p>
                             {pkg.discountedPrice && (
                                <p className="text-sm text-slate-400 line-through">₹{pkg.discountedPrice.toLocaleString('en-IN')}</p>
                             )}
                          </div>
                        </div>
                        <Link href={`/trekking/${pkg.slug}`} className="bg-primary text-white hover:bg-primary/90 px-6 py-2.5 rounded-xl font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2">
                          Details <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-3">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    className="px-5 py-2.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-slate-600 transition"
                  >
                    Previous
                  </button>
                  <span className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md">
                    {page}
                  </span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-5 py-2.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-slate-600 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : !loading ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Mountain size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No treks found</h3>
              <p className="text-slate-500 mb-6">We couldn't find any treks matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(""); setDifficultyFilter("All"); setPage(1);}}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
              >
                Clear Filters
              </button>
            </div>
          ) : null;
          })()}
        </main>
      </div>
    </div>
  );
}
