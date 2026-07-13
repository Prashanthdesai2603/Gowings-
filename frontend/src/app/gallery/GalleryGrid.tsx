"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Maximize2 } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/animations";

interface MediaItem {
  url: string;
  type: string;
  filename: string;
}

export default function GalleryGrid({ items }: { items: MediaItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? items.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === items.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  // Close on escape key
  if (typeof window !== 'undefined') {
    window.onkeydown = (e) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight' && selectedIndex !== null) setSelectedIndex(selectedIndex === items.length - 1 ? 0 : selectedIndex + 1);
      if (e.key === 'ArrowLeft' && selectedIndex !== null) setSelectedIndex(selectedIndex === 0 ? items.length - 1 : selectedIndex - 1);
    };
  }

  return (
    <>
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        {items.map((item, index) => (
          <StaggerItem 
            key={index} 
            className={`relative rounded-3xl overflow-hidden cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 bg-slate-100 ${
              // Make some items span 2 rows or columns for a masonry-like feel
              index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {item.type === 'video' ? (
              <>
                <video 
                  src={item.url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  muted 
                  loop 
                  playsInline
                  onMouseOver={e => (e.target as HTMLVideoElement).play()}
                  onMouseOut={e => {
                    const video = e.target as HTMLVideoElement;
                    video.pause();
                    video.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-500">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Play size={24} className="ml-1" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <img 
                  src={item.url} 
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                  <Maximize2 size={20} />
                </div>
              </>
            )}
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={28} />
            </button>

            <button 
              className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              onClick={handlePrevious}
            >
              <ChevronLeft size={32} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-full w-full h-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {items[selectedIndex].type === 'video' ? (
                <video 
                  src={items[selectedIndex].url} 
                  className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
                  controls 
                  autoPlay 
                  playsInline
                />
              ) : (
                <img 
                  src={items[selectedIndex].url} 
                  alt={items[selectedIndex].filename}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <span className="text-white/50 text-sm font-medium tracking-widest uppercase">
                  {selectedIndex + 1} / {items.length}
                </span>
              </div>
            </motion.div>

            <button 
              className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
