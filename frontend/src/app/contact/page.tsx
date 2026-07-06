"use client";

import Link from "next/link";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: `Subject: ${formData.subject}\n\nMessage: ${formData.message}`
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Thank you for your message! Our team will get back to you shortly.");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const error = await res.json();
        alert(`Failed to send message: ${error.message}`);
      }
    } catch (error) {
      alert("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Have a question about a package? Want to plan a custom trip? Or simply want to say hello? Our team of travel experts is ready to help you craft your perfect journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Our Office</h3>
                <p className="text-gray-600">Ravi Mill Colony, P B Road<br/>Davanagere - 577003, Karnataka<br/>India</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Phone</h3>
                <p className="text-gray-600">+91 9108620564<br/>+91 9108544923</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-600">thegowings26@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Send us a Message</h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="How can we help you?" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={5} className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition resize-none" placeholder="Tell us more about your inquiry..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                  <Send size={20} /> {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
