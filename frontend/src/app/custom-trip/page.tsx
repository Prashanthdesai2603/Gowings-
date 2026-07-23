"use client";

import { PlaneTakeoff, Map, Calendar, Users, Send } from "lucide-react";
import { useState } from "react";

export default function CustomTripPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: 1,
    destination: "",
    duration: "",
    startDate: "",
    budget: "",
    requirements: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dates = formData.startDate ? `Start: ${formData.startDate}, Duration: ${formData.duration} days` : (formData.duration ? `Duration: ${formData.duration} days` : 'Flexible');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom-trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          travelers: formData.travelers,
          destination: formData.destination,
          dates,
          budget: formData.budget,
          requirements: formData.requirements
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlaneTakeoff size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Received!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for sharing your travel dreams with us. Our expert trip designers are reviewing your requirements and will contact you within 24 hours with a personalized itinerary.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition shadow-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold text-sm tracking-wide uppercase mb-4">
            Tailor-Made Journeys
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Design Your <span className="text-primary">Dream Trip</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Can't find the perfect package? Let us build one exclusively for you. Tell us where you want to go, what you want to do, and we'll craft an itinerary that perfectly matches your style and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10">
                <Map className="text-blue-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">1. Tell us your ideas</h3>
                <p className="text-gray-600 leading-relaxed">Share your dream destinations, preferred travel dates, and what kind of experiences you're looking for.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10">
                <Calendar className="text-purple-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">2. Get your itinerary</h3>
                <p className="text-gray-600 leading-relaxed">Our travel experts will design a customized, day-by-day itinerary tailored specifically to your preferences and budget.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10">
                <Users className="text-green-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">3. Refine & Book</h3>
                <p className="text-gray-600 leading-relaxed">We'll tweak the details until it's absolutely perfect. Once approved, we handle all the bookings and logistics.</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Custom Trip Request Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="+91 9108620564" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                    <input type="number" name="travelers" value={formData.travelers} onChange={handleChange} min="1" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="2" />
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dream Destination(s) <span className="text-red-500">*</span></label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="E.g. Bali, Paris, Kerala" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (Days)</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="7" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget Per Person (₹)</label>
                    <input type="number" name="budget" value={formData.budget} onChange={handleChange} step="1000" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="50000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more about your ideal trip</label>
                  <textarea 
                    rows={4} 
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none" 
                    placeholder="Are you looking for adventure, relaxation, cultural experiences, or a mix of everything? Do you have any specific hotels or activities in mind?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    "Sending Request..."
                  ) : (
                    <>
                      <Send size={20} /> Submit Trip Request
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
