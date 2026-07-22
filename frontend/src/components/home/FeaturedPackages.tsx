"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Flame, Users, Mountain } from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "../ui/animations";

export default function FeaturedPackages() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/trips?limit=6`;
        const res = await fetch(url);
        if (res.ok) {
          const responseData = await res.json();
          const packages = Array.isArray(responseData.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []);
          // For demo purposes, if we don't have enough featured, we just take the first 6
          const featuredPkgs = packages.filter((pkg: any) => pkg.isFeatured).slice(0, 6);
          setFeatured(featuredPkgs.length > 0 ? featuredPkgs : packages.slice(0, 6));
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
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <SlideUp className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-orange-100 text-secondary px-4 py-1.5 rounded-full mb-4">
            <Flame className="w-4 h-4 fill-secondary" />
            <span className="text-sm font-bold tracking-wide uppercase">Trending Now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">Most Popular Packages</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Explore our most popular and highly rated travel experiences carefully curated just for you.
          </p>
        </SlideUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((pkg, index) => {
            const hasDiscount = pkg.discountedPrice && pkg.discountedPrice < pkg.price;
            const discountPercent = hasDiscount ? Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100) : 0;
            const displayPrice = hasDiscount ? pkg.discountedPrice : pkg.price;

            return (
              <StaggerItem key={pkg.id} className="h-full">
                <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-slate-100 group flex flex-col h-full transform hover:-translate-y-1">
                  
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden shrink-0">
                    <img 
                      src={pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Top Tags */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {hasDiscount && (
                        <div className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                          {discountPercent}% OFF
                        </div>
                      )}
                      {pkg.isFeatured && (
                        <div className="bg-secondary text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg w-max">
                          BESTSELLER
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Star size={14} className="fill-accent text-accent" /> 4.9
                    </div>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/20">
                          <Clock size={14} /> {pkg.duration || "Multi-day"}
                        </span>
                        <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/20">
                          <Mountain size={14} /> {pkg.difficulty || "Moderate"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                        {pkg.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-slate-500 mb-4 text-sm font-medium">
                      <MapPin size={16} className="text-primary mr-1"/> {pkg.destination?.name || "Multiple Locations"}
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px w-full bg-slate-100 my-4" />
                    
                    <div className="flex items-center justify-between mb-6 mt-auto">
                      <div className="flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                        <Users size={16} /> Only 4 seats left
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Price</p>
                        <div className="flex items-end gap-2">
                          <p className="text-2xl font-black text-slate-800">₹{displayPrice.toLocaleString('en-IN')}</p>
                          {hasDiscount && (
                            <p className="text-sm font-bold text-slate-400 line-through mb-1">₹{pkg.price.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Link href={pkg.category?.name === "Trekking" ? `/trekking/${pkg.slug}` : `/packages/${pkg.slug}`} className="py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-center hover:bg-slate-50 hover:border-slate-300 transition-all">
                        View Details
                      </Link>
                      <Link href={pkg.category?.name === "Trekking" ? `/trekking/${pkg.slug}#book` : `/packages/${pkg.slug}#book`} className="py-3 bg-primary text-white rounded-xl font-bold text-center hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
        
        <SlideUp delay={0.4} className="mt-16 text-center">
          <Link href="/packages" className="inline-block bg-white text-primary border-2 border-primary px-8 py-3.5 rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
            View All Packages
          </Link>
        </SlideUp>
      </div>
    </section>
  );
}
