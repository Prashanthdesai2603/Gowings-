"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Clock, Star, Calendar, CheckCircle, XCircle, ArrowLeft, Send, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Share2, Heart, MessageCircle, Info } from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { motion, AnimatePresence } from "framer-motion";

export default function PackageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeItineraryDay, setActiveItineraryDay] = useState<number | null>(0);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [guests, setGuests] = useState(1);
  const [travelers, setTravelers] = useState([{ name: "", age: "" }]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    setTravelers((prev) => {
      const newTravelers = [...prev];
      if (guests > prev.length) {
        for (let i = prev.length; i < guests; i++) {
          newTravelers.push({ name: "", age: "" });
        }
      } else {
        newTravelers.splice(guests);
      }
      return newTravelers;
    });
  }, [guests]);

  const handleTravelerChange = (index: number, field: string, value: string) => {
    const newTravelers = [...travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setTravelers(newTravelers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book this package.");
      router.push("/auth/login");
      return;
    }
    setBookingStep(1);
    setShowBookingModal(true);
  };

  const nextStep = () => {
    if (bookingStep === 1) {
      const isValid = travelers.every(t => t.name.trim() !== "" && t.age !== "");
      if (!isValid) {
        alert("Please fill in all passenger details.");
        return;
      }
    }
    if (bookingStep === 2 && paymentMethod === "CARD") {
      setPaymentScreenshot("simulated_card_payment");
      setBookingStep(4); 
      return;
    }
    setBookingStep(bookingStep + 1);
  };

  const confirmBooking = async () => {
    if (paymentMethod !== "CARD" && !paymentScreenshot) {
      alert("Please upload payment proof.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;
    
    setIsBooking(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId: pkg.id,
          travelerDetails: travelers,
          totalAmount: pkg.price * guests,
          paymentMethod,
          paymentScreenshot
        })
      });

      if (res.ok) {
        setBookingStep(4);
      } else {
        const error = await res.json();
        alert(`Booking failed: ${error.message}`);
      }
    } catch (error) {
      alert("Server error occurred during booking.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi, I am interested in the package: ${pkg.title}. Please provide more details.`;
    window.open(`https://wa.me/9108620564?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWishlist = () => {
    alert("Added to wishlist!");
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message })
      });
      if (res.ok) {
        alert("Inquiry sent successfully!");
        setShowInquiryModal(false);
      } else {
        alert("Failed to send inquiry. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending inquiry.");
    }
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${slug}`);
        if (res.ok) {
          const data = await res.json();
          
          // Safely parse JSON array fields
          const parseArray = (field: any) => {
            if (Array.isArray(field)) return field;
            if (typeof field === 'string') {
              try { return JSON.parse(field); } 
              catch { return field ? [field] : []; }
            }
            return [];
          };

          if (data) {
            data.highlights = parseArray(data.highlights);
            data.itinerary = parseArray(data.itinerary);
            data.inclusions = parseArray(data.inclusions);
            data.exclusions = parseArray(data.exclusions);
            data.images = parseArray(data.images);
          }
          
          setPkg(data);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error("Failed to fetch package:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPackage();
    }
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Package Not Found</h1>
        <p className="text-slate-500 mb-8 font-medium">The trip you are looking for does not exist or has been removed.</p>
        <Link href="/packages" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg">
          <ArrowLeft size={18} /> Back to Packages
        </Link>
      </div>
    );
  }

  const bgImage = pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] w-full mx-auto max-w-[1920px] rounded-b-[40px] overflow-hidden shadow-2xl mb-12">
        <div className="absolute inset-0">
          <img 
            src={bgImage} 
            alt={pkg.title} 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/10"></div>
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 z-10">
          <Link href="/packages" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wider w-fit bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <ArrowLeft size={16} /> Back to Packages
          </Link>
          
          <SlideUp>
            <div className="flex gap-3 mb-4">
              <span className="bg-accent text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                {pkg.category?.name || "Tour"}
              </span>
              {pkg.isFeatured && (
                <span className="bg-secondary text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white font-semibold text-lg bg-white/10 backdrop-blur-md w-fit px-6 py-3 rounded-2xl border border-white/20">
              <span className="flex items-center gap-2"><MapPin size={22} className="text-accent" /> {pkg.destination?.name || "Global"}</span>
              <span className="w-px h-6 bg-white/30 hidden sm:block"></span>
              <span className="flex items-center gap-2"><Clock size={22} className="text-accent" /> {pkg.duration || "Multi-day"}</span>
              <span className="w-px h-6 bg-white/30 hidden sm:block"></span>
              <span className="flex items-center gap-2"><Star size={22} className="text-accent fill-accent" /> {pkg.reviews?.length ? `${pkg.reviews.length} Reviews` : "4.9 (120 Reviews)"}</span>
            </div>
          </SlideUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
        
        {/* Main Content (Left Column) */}
        <div className="w-full lg:w-2/3 space-y-10">
          
          <FadeIn className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-6">Overview</h2>
            <div className="prose prose-lg max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap mb-10">
              {pkg.fullDescription || pkg.overview}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
              <div className="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pickup</span>
                <span className="text-slate-800 font-bold">{pkg.pickupPoint || "Any"}</span>
              </div>
              <div className="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Drop</span>
                <span className="text-slate-800 font-bold">{pkg.dropPoint || "Any"}</span>
              </div>
              <div className="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Transport</span>
                <span className="text-slate-800 font-bold">{pkg.transportation || "Included"}</span>
              </div>
              <div className="flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Meals</span>
                <span className="text-slate-800 font-bold">{pkg.meals || "Included"}</span>
              </div>
            </div>
          </FadeIn>

          {pkg.highlights && pkg.highlights.length > 0 && (
            <SlideUp className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-2">
                <Star className="text-secondary fill-secondary" /> Trip Highlights
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {pkg.highlights.map((highlight: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-primary shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-600 font-medium leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </SlideUp>
          )}

          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <SlideUp className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-2">
                <Calendar className="text-primary" /> Detailed Itinerary
              </h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day: any, idx: number) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => setActiveItineraryDay(activeItineraryDay === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold shrink-0">
                          D{idx + 1}
                        </span>
                        <span className="font-extrabold text-slate-800 text-lg">{day.title || `Day ${idx + 1}`}</span>
                      </div>
                      {activeItineraryDay === idx ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                    </button>
                    
                    <AnimatePresence>
                      {activeItineraryDay === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-white"
                        >
                          <div className="p-6 pt-4 text-slate-600 font-medium leading-relaxed pl-20">
                            {day.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </SlideUp>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SlideUp className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> What's Included
              </h2>
              <ul className="space-y-4">
                {pkg.inclusions?.length ? pkg.inclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium">
                    <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5 bg-green-50 rounded-full p-0.5" /> {item}
                  </li>
                )) : <li className="text-slate-500 italic font-medium">Not specified</li>}
              </ul>
            </SlideUp>

            <SlideUp className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <XCircle className="text-red-400" /> What's Excluded
              </h2>
              <ul className="space-y-4">
                {pkg.exclusions?.length ? pkg.exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium">
                    <XCircle size={20} className="text-red-400 shrink-0 mt-0.5 bg-red-50 rounded-full p-0.5" /> {item}
                  </li>
                )) : <li className="text-slate-500 italic font-medium">Not specified</li>}
              </ul>
            </SlideUp>
          </div>
        </div>

        {/* Sticky Booking Sidebar (Right Column) */}
        <aside className="w-full lg:w-1/3">
          <div className="sticky top-28">
            <FadeIn className="bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100 p-8 mb-6">
              <div className="mb-8">
                <p className="text-slate-500 font-bold uppercase tracking-wider mb-2 text-xs">Starting from</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-5xl font-black text-slate-800">₹{pkg.price.toLocaleString('en-IN')}</h3>
                  <span className="text-slate-500 font-bold pb-2">/ person</span>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex items-center justify-between text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2"><Clock size={18} className="text-primary"/> Duration</span>
                  <span className="font-bold text-slate-800">{pkg.duration || "Flexible"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2"><Calendar size={18} className="text-primary"/> Best Time</span>
                  <span className="font-bold text-slate-800">{pkg.bestTime || "Year-round"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2"><MapPin size={18} className="text-primary"/> Start City</span>
                  <span className="font-bold text-slate-800">{pkg.startingCity || "Multiple"}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <button onClick={handleBookClick} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(15,118,110,0.4)] hover:shadow-[0_15px_35px_rgba(15,118,110,0.5)] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Book This Package
                </button>
                
                <button onClick={() => setShowInquiryModal(true)} className="w-full bg-white text-primary border-2 border-primary py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  Send Inquiry
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center py-3 bg-green-50 rounded-xl text-green-600 hover:bg-green-100 transition-colors font-bold text-xs gap-1">
                  <MessageCircle size={20} />
                  WhatsApp
                </button>
                <button onClick={handleShare} className="flex flex-col items-center justify-center py-3 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors font-bold text-xs gap-1">
                  <Share2 size={20} />
                  Share
                </button>
                <button onClick={handleWishlist} className="flex flex-col items-center justify-center py-3 bg-red-50 rounded-xl text-red-500 hover:bg-red-100 transition-colors font-bold text-xs gap-1">
                  <Heart size={20} />
                  Wishlist
                </button>
              </div>
            </FadeIn>
            
            <FadeIn className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-center shadow-xl">
              <p className="text-sm text-slate-300 font-bold mb-3 uppercase tracking-wider">Need a custom itinerary?</p>
              <button className="text-white bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 w-full">
                <Send size={18} /> Contact our experts
              </button>
            </FadeIn>
          </div>
        </aside>
      </div>

      {/* Booking Modal (Modernized) */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowBookingModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-3xl relative z-10 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 shrink-0">
                <h2 className="text-3xl font-extrabold text-slate-800">Secure Booking</h2>
                <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-full">
                  <XCircle size={24} />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-10 shrink-0 px-4">
                {[
                  { step: 1, title: "Details" },
                  { step: 2, title: "Payment" },
                  { step: 3, title: "Verification" },
                  { step: 4, title: "Done" }
                ].map((s, i) => (
                  <div key={s.step} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${bookingStep >= s.step ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 text-slate-400'}`}>
                      {s.step}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${bookingStep >= s.step ? 'text-primary' : 'text-slate-400'}`}>{s.title}</span>
                  </div>
                ))}
                {/* Connecting lines */}
                <div className="absolute top-5 left-12 right-12 h-1 bg-slate-100 -z-0">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((bookingStep - 1) / 3) * 100}%` }}></div>
                </div>
              </div>

              <div className="overflow-y-auto pr-2 flex-grow mb-6 custom-scrollbar">
                
                {bookingStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex justify-between items-center">
                      <div>
                        <p className="text-primary font-black text-xl mb-1">{pkg.title}</p>
                        <p className="text-slate-600 font-medium">₹{pkg.price.toLocaleString('en-IN')} per person</p>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase">Guests</label>
                        <input 
                          type="number" 
                          min="1" max="20" 
                          value={guests} 
                          onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                          className="w-16 text-lg font-black text-slate-800 outline-none bg-transparent ml-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-extrabold text-xl text-slate-800">Passenger Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {travelers.map((traveler, index) => (
                          <div key={index} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Passenger {index + 1}</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                                <input 
                                  type="text" 
                                  value={traveler.name}
                                  onChange={(e) => handleTravelerChange(index, "name", e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-slate-700 transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Age</label>
                                <input 
                                  type="number" 
                                  value={traveler.age}
                                  onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-slate-700 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                      <p className="text-slate-500 font-bold uppercase tracking-wider mb-2">Total Amount</p>
                      <h2 className="text-5xl font-black text-slate-800">₹{(pkg.price * guests).toLocaleString('en-IN')}</h2>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xl text-slate-800 mb-4">Select Payment Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                          onClick={() => setPaymentMethod("UPI")}
                          className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${paymentMethod === "UPI" ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 bg-white hover:border-primary/40'}`}
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className={`h-8 object-contain ${paymentMethod !== "UPI" && 'grayscale opacity-60'}`} />
                          <span className={`font-bold ${paymentMethod === "UPI" ? 'text-primary' : 'text-slate-500'}`}>UPI QR Code</span>
                        </button>
                        
                        <button 
                          onClick={() => setPaymentMethod("BANK_TRANSFER")}
                          className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${paymentMethod === "BANK_TRANSFER" ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 bg-white hover:border-primary/40'}`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xl bg-slate-100 ${paymentMethod === "BANK_TRANSFER" && 'bg-primary text-white'}`}>🏦</div>
                          <span className={`font-bold ${paymentMethod === "BANK_TRANSFER" ? 'text-primary' : 'text-slate-500'}`}>Bank Transfer</span>
                        </button>

                        <button 
                          onClick={() => setPaymentMethod("CARD")}
                          className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${paymentMethod === "CARD" ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 bg-white hover:border-primary/40'}`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xl bg-slate-100 ${paymentMethod === "CARD" && 'bg-primary text-white'}`}>💳</div>
                          <span className={`font-bold ${paymentMethod === "CARD" ? 'text-primary' : 'text-slate-500'}`}>Credit / Debit</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    {paymentMethod === "UPI" && (
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                        <h3 className="font-extrabold text-xl text-slate-800 mb-6">Scan QR Code to Pay</h3>
                        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 mb-6">
                          <img src="/qr-code.jpeg" alt="UPI QR Code" className="w-56 h-56 object-cover rounded-xl" />
                        </div>
                        <p className="text-slate-500 font-medium">Use Google Pay, PhonePe, or Paytm.</p>
                      </div>
                    )}

                    {paymentMethod === "BANK_TRANSFER" && (
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <h3 className="font-extrabold text-xl text-slate-800 mb-6 text-center">Bank Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Bank Name</p>
                            <p className="font-bold text-slate-800">Canara Bank</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Account Name</p>
                            <p className="font-bold text-slate-800">Prashantha Gururaj Desai</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Account Number</p>
                            <p className="font-bold text-slate-800 tracking-wider">0508108063645</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">IFSC Code</p>
                            <p className="font-bold text-slate-800">CNRB0000508</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
                      <h3 className="font-extrabold text-xl text-primary mb-2">Upload Payment Proof</h3>
                      <p className="text-slate-600 font-medium mb-6">Please upload a screenshot of your successful transaction.</p>
                      
                      <label className="flex flex-col items-center justify-center w-full h-40 bg-white border-2 border-dashed border-primary/40 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                          </div>
                          <p className="font-bold text-slate-700 mb-1"><span className="text-primary">Click to upload</span></p>
                          <p className="text-xs font-medium text-slate-500">PNG, JPG up to 5MB</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                      
                      {paymentScreenshot && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-500 text-white rounded-full p-1"><CheckCircle size={16} /></div>
                            <span className="font-bold text-green-700">Screenshot uploaded</span>
                          </div>
                          <button onClick={() => setPaymentScreenshot(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><XCircle size={18} /></button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {bookingStep === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-xl shadow-green-100">
                      <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-4">Booking Successful!</h2>
                    <p className="text-slate-600 font-medium mb-8 max-w-md">Your trip to {pkg.title} has been booked. We have sent the confirmation details to your registered email.</p>
                    <Link href="/dashboard" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                      Go to Dashboard
                    </Link>
                  </motion.div>
                )}
              </div>

              {bookingStep < 4 && (
                <div className="flex gap-4 border-t border-slate-100 pt-6 shrink-0 mt-auto">
                  {bookingStep > 1 && (
                    <button 
                      onClick={() => setBookingStep(bookingStep - 1)}
                      className="px-8 py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      Back
                    </button>
                  )}
                  {bookingStep < 3 ? (
                    <button 
                      onClick={nextStep}
                      className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button 
                      onClick={confirmBooking}
                      disabled={isBooking || (paymentMethod !== "CARD" && !paymentScreenshot)}
                      className="flex-1 py-4 bg-green-500 text-white rounded-xl font-black text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBooking ? "Confirming Booking..." : "Submit & Confirm Booking"}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Inquiry Modal (Modernized) */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowInquiryModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-800">Send Inquiry</h2>
                <button onClick={() => setShowInquiryModal(false)} className="text-slate-400 hover:text-red-500 bg-slate-50 p-2 rounded-full transition-colors">
                  <XCircle size={20} />
                </button>
              </div>
              <form onSubmit={handleInquirySubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Name</label>
                  <input name="name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-colors font-medium text-slate-800" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email</label>
                  <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-colors font-medium text-slate-800" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone</label>
                  <input name="phone" type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-colors font-medium text-slate-800" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
                  <textarea name="message" required rows={4} defaultValue={`I am interested in ${pkg.title}.`} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white transition-colors font-medium text-slate-800 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-1 text-lg">
                  Submit Inquiry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
