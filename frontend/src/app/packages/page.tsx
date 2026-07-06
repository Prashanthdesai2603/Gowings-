"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Clock, Star, Filter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips`);
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const categories = ["All", "Domestic", "International", "Adventure", "Honeymoon", "Family"];

  const filteredPackages = packages.filter((pkg) => {
    const destName = pkg.destination?.name || "";
    const catName = pkg.category?.name || "";
    
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          destName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || catName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="bg-primary text-primary-foreground py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Packages</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Find the perfect travel experience curated just for you. From relaxing beaches to adventurous mountains.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Filter size={20} className="text-accent" /> Filters
            </h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Search Destination</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Goa, Dubai..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Categories</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat}
                      checked={categoryFilter === cat}
                      onChange={() => setCategoryFilter(cat)}
                      className="w-4 h-4 text-primary accent-primary"
                    />
                    <span className="text-gray-600 group-hover:text-primary transition">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Price Range</h3>
              <input type="range" className="w-full accent-primary" min="5000" max="100000" />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹5,000</span>
                <span>₹1,00,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Packages Grid */}
        <main className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredPackages.length} {filteredPackages.length === 1 ? 'Package' : 'Packages'} Found
            </h2>
            <select className="border py-2 px-4 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 text-gray-700">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPackages.map((pkg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={pkg.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary flex items-center gap-1 shadow-sm">
                      <Star size={14} className="text-accent fill-accent" /> {pkg.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {pkg.category?.name || "Tour"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition">{pkg.title}</h3>
                    <div className="flex items-center text-gray-500 mb-4 gap-4 text-sm">
                      <span className="flex items-center gap-1"><MapPin size={16} className="text-accent"/> {pkg.destination?.name || "Anywhere"}</span>
                      <span className="flex items-center gap-1"><Clock size={16} className="text-accent"/> {pkg.duration || "Multi-day"}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center mt-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Starting from</p>
                        <p className="text-xl font-bold text-primary">₹{pkg.price.toLocaleString('en-IN')}</p>
                      </div>
                      <Link href={`/packages/${pkg.slug}`} className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-lg font-semibold transition">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No packages found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setSearchTerm(""); setCategoryFilter("All");}}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
