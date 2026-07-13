"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/animations";

interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl?: string;
  image?: string;
  _count?: {
    trips: number;
  };
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations`);
        if (res.ok) {
          const responseData = await res.json();
          let extractedDestinations: Destination[] = [];
          if (responseData && Array.isArray(responseData.data)) {
            extractedDestinations = responseData.data;
          } else if (Array.isArray(responseData)) {
            extractedDestinations = responseData;
          }
          setDestinations(extractedDestinations);
        } else {
          setDestinations([]);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SlideUp className="text-center mb-20">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-50 text-accent px-4 py-1.5 rounded-full mb-6 border border-blue-100">
            <Compass className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide uppercase">Discover</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-slate-800 tracking-tight">Explore Destinations</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Discover the most breathtaking locations around the world. Your next adventure awaits.
          </p>
        </SlideUp>

        {(() => {
          const safeDestinations = Array.isArray(destinations) ? destinations : [];
          return loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-3xl h-[400px] bg-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : safeDestinations.length === 0 ? (
            <FadeIn className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Compass size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No destinations found</h3>
              <p className="text-slate-500 font-medium">Stay tuned as we add more beautiful places to visit!</p>
            </FadeIn>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeDestinations.map((dest, index) => {
                // Mock package count if backend doesn't provide it
                const packageCount = dest._count?.trips || Math.floor(Math.random() * 15) + 5;
                
                return (
                  <StaggerItem key={dest.id} className="h-full">
                    <Link href={`/destinations?state=${dest.name.toLowerCase()}`}>
                      <div className="group relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 h-[400px] cursor-pointer transform hover:-translate-y-1 block">
                        <img 
                          src={dest.imageUrl || dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"} 
                          alt={dest.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out bg-slate-200"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-300" />
                        
                        {/* Top Badge */}
                        <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                          {packageCount} Packages
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="flex items-center gap-1.5 text-accent font-bold mb-2 text-sm uppercase tracking-wider">
                            <MapPin size={16} /> {dest.country}
                          </p>
                          <h3 className="text-3xl font-extrabold text-white mb-3 drop-shadow-md">{dest.name}</h3>
                          
                          <div className="flex items-center gap-2 text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            Explore packages <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          );
        })()}
      </div>
    </div>
  );
}
