"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";

export default function FeaturedPackages() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/trips?limit=6`);
        if (res.ok) {
          const responseData = await res.json();
          const packages = responseData.data ? responseData.data : responseData;
          setFeatured(packages.filter((pkg: any) => pkg.isFeatured).slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch featured packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading || featured.length === 0) return null;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Featured Travel Packages</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our most popular and highly rated travel experiences carefully curated just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((pkg, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={pkg.id} 
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col"
          >
            <div className="relative h-64 overflow-hidden shrink-0">
              <img 
                src={pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"} 
                alt={pkg.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                FEATURED
              </div>
            </div>
            <div className="p-6 flex flex-col grow">
              <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition line-clamp-1">{pkg.title}</h3>
              <div className="flex flex-wrap items-center text-gray-500 mb-4 gap-4 text-sm">
                <span className="flex items-center gap-1"><MapPin size={16} className="text-accent"/> {pkg.destination?.name || "Anywhere"}</span>
                <span className="flex items-center gap-1"><Clock size={16} className="text-accent"/> {pkg.duration || "Multi-day"}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-6 grow">{pkg.overview}</p>
              <div className="border-t pt-4 flex justify-between items-center mt-auto">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Starting from</p>
                  <p className="text-xl font-bold text-primary">₹{pkg.price.toLocaleString('en-IN')}</p>
                </div>
                <Link href={`/packages/${pkg.slug}`} className="bg-primary text-white hover:bg-primary/90 px-5 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg">
                  View
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/packages" className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-xl font-bold hover:bg-primary/5 transition">
          View All Packages
        </Link>
      </div>
    </section>
  );
}
