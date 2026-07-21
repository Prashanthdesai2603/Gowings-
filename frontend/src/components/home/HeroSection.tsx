"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, PlaneTakeoff, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { FadeIn, SlideUp } from "../ui/animations";

export default function HeroSection() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Anytime");
  const [travelers, setTravelers] = useState("2");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations`);
        if (destRes.ok) {
          const resData = await destRes.json();
          setDestinations(resData.data || resData || []);
        }

        const tripsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips`);
        if (tripsRes.ok) {
          const resData = await tripsRes.json();
          setTrips(resData.data || resData || []);
        }
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (selectedDestination) {
      router.push(`/destinations?state=${selectedDestination.toLowerCase()}`);
    } else {
      router.push(`/trekking`);
    }
  };

  // Get unique starting cities from trips
  const startingCities = Array.from(new Set(trips.map(t => t.startingCity).filter(Boolean)));

  return (
    <div className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-slate-900 pt-20 pb-32">
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900 z-0" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center flex flex-col items-center">
        <div className="w-full max-w-4xl text-white">
          <SlideUp>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-xl">
              Explore the World with <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">Gowings</span>
            </h1>
          </SlideUp>
          
          <SlideUp delay={0.2}>
            <p className="text-lg md:text-2xl mb-12 font-medium text-slate-200 drop-shadow-md">
              Discover amazing destinations, customized travel experiences, and affordable holiday packages designed just for you.
            </p>
          </SlideUp>

          {/* Comprehensive Search Bar */}
          <SlideUp delay={0.4}>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl mb-12 mx-auto max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Destination */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors text-left">
                  <MapPin className="text-primary w-5 h-5 shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Destination</span>
                    <select 
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full cursor-pointer appearance-none"
                    >
                      <option value="">Any Destination</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Departure (Populated from trips) */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors text-left">
                  <PlaneTakeoff className="text-primary w-5 h-5 shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Departure</span>
                    <select className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full cursor-pointer appearance-none">
                      <option value="">Any City</option>
                      {startingCities.map((city, idx) => (
                        <option key={idx} value={city as string}>{city as string}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Month */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors text-left">
                  <Calendar className="text-primary w-5 h-5 shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Month</span>
                    <select 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full cursor-pointer appearance-none"
                    >
                      <option>Anytime</option>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                      <option>April</option>
                      <option>May</option>
                      <option>June</option>
                      <option>July</option>
                      <option>August</option>
                      <option>September</option>
                      <option>October</option>
                      <option>November</option>
                      <option>December</option>
                    </select>
                  </div>
                </div>

                {/* Travelers */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors text-left">
                  <Users className="text-primary w-5 h-5 shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Travelers</span>
                    <input 
                      type="number" 
                      min="1" 
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2 w-full justify-center text-lg md:text-base"
                >
                  <Search className="w-5 h-5" />
                  Search Packages
                </button>
              </div>
            </div>
          </SlideUp>

          {/* Statistics */}
          <SlideUp delay={0.6}>
            <div className="flex flex-wrap gap-8 items-center justify-center border-t border-white/20 pt-8 mt-4">
              <div>
                <h4 className="text-3xl font-black text-white">5000+</h4>
                <p className="text-sm text-slate-300 font-bold tracking-wide uppercase mt-1">Travelers</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block"></div>
              <div>
                <h4 className="text-3xl font-black text-white">250+</h4>
                <p className="text-sm text-slate-300 font-bold tracking-wide uppercase mt-1">Trips Planned</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block"></div>
              <div>
                <h4 className="text-3xl font-black text-accent flex items-center justify-center gap-1">4.9<Star className="w-6 h-6 fill-accent" /></h4>
                <p className="text-sm text-slate-300 font-bold tracking-wide uppercase mt-1">Rating</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block"></div>
              <div>
                <h4 className="text-3xl font-black text-white">100+</h4>
                <p className="text-sm text-slate-300 font-bold tracking-wide uppercase mt-1">Destinations</p>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}
