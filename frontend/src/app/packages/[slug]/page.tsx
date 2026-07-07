"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Clock, Star, Calendar, CheckCircle, XCircle, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Share2, Heart, MessageCircle, Info } from "lucide-react";

export default function PackageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [guests, setGuests] = useState(1);
  const [travelers, setTravelers] = useState([{ name: "", age: "" }]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Update travelers array when guests count changes
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
      // Validate travelers
      const isValid = travelers.every(t => t.name.trim() !== "" && t.age !== "");
      if (!isValid) {
        alert("Please fill in all passenger details.");
        return;
      }
    }
    if (bookingStep === 2 && paymentMethod === "CARD") {
      alert("Live Payment Gateway Integration requires API Keys (Stripe/Razorpay). Simulating successful card payment for now.");
      setPaymentScreenshot("simulated_card_payment");
      setBookingStep(3); // Skip to confirm
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
        alert("Booking created successfully!");
        setShowBookingModal(false);
        router.push("/dashboard");
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

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${slug}`);
        if (res.ok) {
          const data = await res.json();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Package Not Found</h1>
        <p className="text-gray-500 mb-8">The trip you are looking for does not exist or has been removed.</p>
        <Link href="/packages" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Packages
        </Link>
      </div>
    );
  }

  const bgImage = pkg.images?.[0] || pkg.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full flex items-end">
        <div className="absolute inset-0">
          <img 
            src={bgImage} 
            alt={pkg.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        </div>
        
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 z-10">
          <Link href="/packages" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition">
            <ArrowLeft size={16} /> Back to Packages
          </Link>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex gap-2 mb-3">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {pkg.category?.name || "Tour"}
              </span>
              {pkg.isFeatured && (
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium text-lg">
              <span className="flex items-center gap-2"><MapPin size={20} className="text-accent" /> {pkg.destination?.name || "Global"}</span>
              <span className="flex items-center gap-2"><Clock size={20} className="text-accent" /> {pkg.duration || "Multi-day Trip"}</span>
              <span className="flex items-center gap-2"><Star size={20} className="text-accent fill-accent" /> {pkg.reviews?.length ? `${pkg.reviews.length} Reviews` : "New Package"}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 space-y-12">
          
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Overview</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap text-lg mb-8">
              {pkg.fullDescription || pkg.overview}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm font-medium mb-1">Pickup</span>
                <span className="text-gray-800 font-semibold">{pkg.pickupPoint || "Any"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm font-medium mb-1">Drop</span>
                <span className="text-gray-800 font-semibold">{pkg.dropPoint || "Any"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm font-medium mb-1">Transport</span>
                <span className="text-gray-800 font-semibold">{pkg.transportation || "Included"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm font-medium mb-1">Meals</span>
                <span className="text-gray-800 font-semibold">{pkg.meals || "Included"}</span>
              </div>
              <div className="flex flex-col mt-4">
                <span className="text-gray-400 text-sm font-medium mb-1">Accommodation</span>
                <span className="text-gray-800 font-semibold">{pkg.accommodation || "Included"}</span>
              </div>
            </div>
          </motion.section>

          {pkg.highlights && pkg.highlights.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Highlights</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.highlights.map((highlight: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Star className="text-accent shrink-0 mt-1" size={20} />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Itinerary</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {pkg.itinerary.map((day: any, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <span className="font-bold text-white text-sm">D{idx + 1}</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-800">{day.title || `Day ${idx + 1}`}</div>
                      </div>
                      <div className="text-slate-600 mt-2">{day.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> Inclusions
              </h2>
              <ul className="space-y-3">
                {pkg.inclusions?.length ? pkg.inclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" /> {item}
                  </li>
                )) : <li className="text-gray-500 italic">Not specified</li>}
              </ul>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <XCircle className="text-red-400" /> Exclusions
              </h2>
              <ul className="space-y-3">
                {pkg.exclusions?.length ? pkg.exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" /> {item}
                  </li>
                )) : <li className="text-gray-500 italic">Not specified</li>}
              </ul>
            </motion.section>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <aside className="w-full lg:w-1/3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-28"
          >
            <div className="mb-6">
              <p className="text-gray-500 font-medium mb-1">Starting from</p>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-extrabold text-primary">₹{pkg.price.toLocaleString('en-IN')}</h3>
                <span className="text-gray-500 font-medium pb-1">/ person</span>
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-2"><Clock size={18} /> Duration</span>
                <span className="font-semibold text-gray-800">{pkg.duration || "Flexible"}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-2"><Calendar size={18} /> Best Time</span>
                <span className="font-semibold text-gray-800">{pkg.bestTime || "Year-round"}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-2"><MapPin size={18} /> Starting City</span>
                <span className="font-semibold text-gray-800">{pkg.startingCity || "Multiple"}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-2"><Info size={18} /> Difficulty</span>
                <span className="font-semibold text-gray-800">{pkg.difficulty || "Easy"}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button onClick={handleBookClick} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Book This Package
              </button>
              
              <button onClick={() => setShowInquiryModal(true)} className="w-full bg-white text-primary border-2 border-primary py-3 rounded-xl font-bold text-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                Send Inquiry
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-green-50 text-green-600 transition group">
                <MessageCircle size={20} className="mb-1 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold">WhatsApp</span>
              </button>
              <button onClick={handleShare} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition group">
                <Share2 size={20} className="mb-1 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold">Share</span>
              </button>
              <button onClick={handleWishlist} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-red-50 text-red-500 transition group">
                <Heart size={20} className="mb-1 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold">Wishlist</span>
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-400 mt-4">
              No hidden fees. Instant confirmation.
            </p>

            <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <p className="text-sm text-gray-600 font-medium mb-2">Need a custom itinerary?</p>
              <button className="text-primary font-bold hover:underline flex items-center justify-center gap-1 w-full">
                <Send size={16} /> Contact our experts
              </button>
            </div>
          </motion.div>
        </aside>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto pt-24">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl my-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-red-500">
                <XCircle size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              <div className={`h-2 flex-1 rounded-full ${bookingStep >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`h-2 flex-1 rounded-full ${bookingStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`h-2 flex-1 rounded-full ${bookingStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 mb-6">
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-gray-600">Package: <strong>{pkg.title}</strong></p>
                    <p className="text-gray-600">Price: <strong>₹{pkg.price.toLocaleString('en-IN')} / person</strong></p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="20" 
                      value={guests} 
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Passenger Details</h3>
                    {travelers.map((traveler, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 bg-white p-4 border rounded-xl shadow-sm">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Passenger {index + 1} Name</label>
                          <input 
                            type="text" 
                            placeholder="Full Name"
                            value={traveler.name}
                            onChange={(e) => handleTravelerChange(index, "name", e.target.value)}
                            className="w-full border-b px-2 py-1 focus:border-primary outline-none"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
                          <input 
                            type="number" 
                            placeholder="Age"
                            value={traveler.age}
                            onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                            className="w-full border-b px-2 py-1 focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-gray-800">Select Payment Method</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setPaymentMethod("UPI")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${paymentMethod === "UPI" ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-primary/50'}`}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-8 object-contain opacity-80" />
                      <span className="font-semibold">UPI / QR Scan</span>
                    </button>
                    
                    <button 
                      onClick={() => setPaymentMethod("BANK_TRANSFER")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${paymentMethod === "BANK_TRANSFER" ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-primary/50'}`}
                    >
                      <div className="h-8 flex items-center"><span className="text-xl font-bold">🏛️</span></div>
                      <span className="font-semibold">Bank Transfer</span>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod("CARD")}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${paymentMethod === "CARD" ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-primary/50'}`}
                    >
                      <div className="h-8 flex items-center"><span className="text-xl font-bold">💳</span></div>
                      <span className="font-semibold">Credit/Debit Card</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                    <p className="text-gray-600 mb-2">Total Amount to Pay</p>
                    <h2 className="text-4xl font-extrabold text-primary">₹{(pkg.price * guests).toLocaleString('en-IN')}</h2>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-6">
                  {paymentMethod === "UPI" && (
                    <div className="text-center space-y-4">
                      <h3 className="font-bold text-lg text-gray-800">Scan QR Code to Pay</h3>
                      <div className="inline-block p-4 bg-white border rounded-2xl shadow-sm">
                        <img src="/qr-code.jpeg" alt="UPI QR Code" className="w-48 h-48 object-cover" />
                      </div>
                      <p className="text-sm text-gray-500">Scan this code using any UPI app (GPay, PhonePe, Paytm)</p>
                    </div>
                  )}

                  {paymentMethod === "BANK_TRANSFER" && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-gray-800">Bank Account Details</h3>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 font-mono text-sm">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500">Bank Name:</span>
                          <span className="font-bold text-gray-800">Canara Bank</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500">Account Name:</span>
                          <span className="font-bold text-gray-800">Prashantha Gururaj Desai</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500">Account Number:</span>
                          <span className="font-bold text-gray-800 tracking-wider">0508108063645</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">IFSC Code:</span>
                          <span className="font-bold text-gray-800">CNRB0000508</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "CARD" && (
                    <div className="text-center py-8">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                          <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Payment Simulated</h3>
                        <p className="text-gray-500">Live gateway will be integrated once API keys are provided.</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod !== "CARD" && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4">Upload Payment Proof</h3>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer bg-primary/5 hover:bg-primary/10 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                          <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-primary">Click to upload</span> screenshot</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                      {paymentScreenshot && (
                        <div className="mt-4 p-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center justify-between">
                          <span>✅ Screenshot uploaded successfully</span>
                          <button onClick={() => setPaymentScreenshot(null)} className="text-red-500 hover:text-red-700"><XCircle size={16} /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4 border-t pt-6">
              {bookingStep > 1 && (
                <button 
                  onClick={() => setBookingStep(bookingStep - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              {bookingStep < 3 ? (
                <button 
                  onClick={nextStep}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-primary/50 transition"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={confirmBooking}
                  disabled={isBooking || (paymentMethod !== "CARD" && !paymentScreenshot)}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isBooking ? "Confirming..." : "Submit Payment & Book"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 pt-24">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md my-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Send Inquiry</h2>
              <button onClick={() => setShowInquiryModal(false)} className="text-gray-400 hover:text-red-500">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent!"); setShowInquiryModal(false); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={3} defaultValue={`I am interested in ${pkg.title}.`} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
