"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl?: string;
  image?: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations`);
        if (res.ok) {
          const data = await res.json();
          setDestinations(data);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Explore Top Destinations</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most breathtaking locations around the world. Your next adventure awaits.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading destinations...</div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No destinations found</h3>
            <p className="text-gray-500">Stay tuned as we add more beautiful places to visit!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={dest.id}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-80 cursor-pointer"
              >
                <img 
                  src={dest.imageUrl || dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-gray-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                  <p className="flex items-center gap-1 text-white/80 font-medium">
                    <MapPin size={16} className="text-accent" /> {dest.country}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
