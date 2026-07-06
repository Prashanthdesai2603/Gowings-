"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Company Settings</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition disabled:opacity-50"
        >
          <Save size={20} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Company Name</label>
            <input 
              type="text" 
              name="name"
              value={settings?.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tagline</label>
            <input 
              type="text" 
              name="tagline"
              value={settings?.tagline || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">About Us</label>
            <textarea 
              name="about"
              value={settings?.about || ""}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 pt-4 border-t border-slate-100">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={settings?.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone Number 1</label>
            <input 
              type="text" 
              name="phone1"
              value={settings?.phone1 || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone Number 2 (Optional)</label>
            <input 
              type="text" 
              name="phone2"
              value={settings?.phone2 || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">WhatsApp</label>
            <input 
              type="text" 
              name="whatsapp"
              value={settings?.whatsapp || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input 
              type="text" 
              name="address"
              value={settings?.address || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">City</label>
            <input 
              type="text" 
              name="city"
              value={settings?.city || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">State / Province</label>
            <input 
              type="text" 
              name="state"
              value={settings?.state || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Country</label>
            <input 
              type="text" 
              name="country"
              value={settings?.country || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Postal / Zip Code</label>
            <input 
              type="text" 
              name="postalCode"
              value={settings?.postalCode || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 pt-4 border-t border-slate-100">Social Media & Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Facebook URL</label>
            <input 
              type="text" 
              name="facebookUrl"
              value={settings?.facebookUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Instagram URL</label>
            <input 
              type="text" 
              name="instagramUrl"
              value={settings?.instagramUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Twitter URL</label>
            <input 
              type="text" 
              name="twitterUrl"
              value={settings?.twitterUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">YouTube URL</label>
            <input 
              type="text" 
              name="youtubeUrl"
              value={settings?.youtubeUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Google Map Embed HTML</label>
            <textarea 
              name="googleMapUrl"
              value={settings?.googleMapUrl || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 pt-4 border-t border-slate-100">Bank Details for Payments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Bank Name</label>
            <input 
              type="text" 
              name="bankName"
              value={settings?.bankName || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Account Holder Name</label>
            <input 
              type="text" 
              name="accountHolderName"
              value={settings?.accountHolderName || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Account Number</label>
            <input 
              type="text" 
              name="accountNumber"
              value={settings?.accountNumber || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">IFSC Code</label>
            <input 
              type="text" 
              name="ifscCode"
              value={settings?.ifscCode || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">UPI ID</label>
            <input 
              type="text" 
              name="upiId"
              value={settings?.upiId || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
