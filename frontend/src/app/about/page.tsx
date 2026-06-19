import Image from "next/image";
import { CheckCircle, Globe, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold text-sm tracking-wide uppercase mb-2">
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              We create unforgettable <span className="text-primary">travel experiences</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded with a passion for exploration, Gowings has grown into a premier travel agency dedicated to crafting personalized journeys. We believe that travel is not just about visiting new places, but about creating memories that last a lifetime.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our team of seasoned travel experts works tirelessly to uncover hidden gems, negotiate the best rates, and design itineraries that perfectly match your unique style and budget.
            </p>
          </div>
          
          <div className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1000&q=80" 
              alt="People traveling" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-50 rounded-3xl p-12 mb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="text-center px-4">
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Globe size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">50+</h3>
            <p className="text-gray-500 font-medium">Destinations</p>
          </div>
          <div className="text-center px-4 pt-8 md:pt-0">
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Users size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">10k+</h3>
            <p className="text-gray-500 font-medium">Happy Travelers</p>
          </div>
          <div className="text-center px-4 pt-8 md:pt-0">
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-500 font-medium">Tours Completed</p>
          </div>
          <div className="text-center px-4 pt-8 md:pt-0">
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Award size={32} />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">15</h3>
            <p className="text-gray-500 font-medium">Years Experience</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose Gowings?</h2>
          <p className="text-lg text-gray-600">
            We don't just book flights and hotels; we curate end-to-end experiences designed entirely around you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow p-8 rounded-2xl">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
            <p className="text-gray-600 leading-relaxed">
              We partner with top-tier hotels and verified local guides to ensure every aspect of your trip meets our rigorous quality standards.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow p-8 rounded-2xl">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
            <p className="text-gray-600 leading-relaxed">
              Your safety is our priority. We provide 24/7 on-trip support and comprehensive travel insurance options for peace of mind.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow p-8 rounded-2xl">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tailored Itineraries</h3>
            <p className="text-gray-600 leading-relaxed">
              No two travelers are alike. We customize every detail of your itinerary to perfectly align with your preferences and pace.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
