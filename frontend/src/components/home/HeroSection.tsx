"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          Explore the World with <span className="text-accent">Gowings</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl max-w-3xl mx-auto mb-10 font-medium"
        >
          Discover amazing destinations, customized travel experiences, and affordable holiday packages designed just for you.
        </motion.p>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-full p-2 md:p-3 flex items-center max-w-4xl mx-auto shadow-2xl mb-12"
        >
          <div className="flex-1 flex px-4 border-r border-gray-200">
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="w-full bg-transparent text-gray-800 outline-none placeholder-gray-500"
            />
          </div>
          <div className="flex-1 hidden md:flex px-4 border-r border-gray-200">
            <input 
              type="text" 
              placeholder="When?" 
              className="w-full bg-transparent text-gray-800 outline-none placeholder-gray-500"
            />
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 rounded-full font-semibold transition flex items-center gap-2">
            <Search className="w-5 h-5" />
            <span className="hidden md:inline">Search</span>
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/packages" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-full font-semibold text-lg transition-transform hover:scale-105">
            Explore Packages
          </Link>
          <Link href="/custom-trip" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/50 text-white px-8 py-3 rounded-full font-semibold text-lg transition-transform hover:scale-105">
            Plan Custom Trip
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
