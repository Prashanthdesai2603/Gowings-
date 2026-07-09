"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditTrekPage() {
  const router = useRouter();
  const params = useParams();
  const trekId = params.id as string;

  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    overview: "",
    price: 0,
    discountedPrice: 0,
    isFeatured: false,
    destinationId: "",
    imageUrl: "",
    duration: "",
    startingCity: "",
    fullDescription: "",
    pickupPoint: "",
    dropPoint: "",
    transportation: "",
    accommodation: "",
    meals: "",
    bestTime: "",
    difficulty: "",
    altitude: "",
    seoTitle: "",
    seoDescription: "",
    refundPolicy: "",
    cancellationPolicy: "",
    paymentTerms: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations`);
        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(Array.isArray(destData.data) ? destData.data : (Array.isArray(destData) ? destData : []));
        }

        // Fetch existing trek
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips?search=`); // Wait, we can't easily fetch by ID without slug unless we modify backend to get by ID. Wait, `/api/trips` has get trips. We can just use standard fetch or use `/api/trips` which supports id in some way? Actually, `/api/treks/:slug` takes a slug. We don't have a GET by ID route for treks/trips directly exposed except by listing or by slug. Let me fetch all treks and find this ID, or... let's check `tripRoutes.ts`... `router.get('/:slug', getTripBySlug)` is used. Wait, what does the edit trip page use?
        
        // Actually, the edit trip page just fetches all and filters, or maybe backend has `getTripById`. Let me fetch by filtering the list.
        const treksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/treks?limit=100`);
        if (treksRes.ok) {
           const treksData = await treksRes.json();
           const pkgs = Array.isArray(treksData.data) ? treksData.data : [];
           const pkg = pkgs.find((p: any) => p.id === trekId);
           if (pkg) {
              if (typeof pkg.images === 'string') {
                 try { pkg.images = JSON.parse(pkg.images); } catch { pkg.images = []; }
              }
              setFormData({
                 title: pkg.title || "",
                 slug: pkg.slug || "",
                 overview: pkg.overview || "",
                 price: pkg.price || 0,
                 discountedPrice: pkg.discountedPrice || 0,
                 isFeatured: pkg.isFeatured || false,
                 destinationId: pkg.destinationId || "",
                 imageUrl: pkg.images?.[0] || "",
                 duration: pkg.duration || "",
                 startingCity: pkg.startingCity || "",
                 fullDescription: pkg.fullDescription || "",
                 pickupPoint: pkg.pickupPoint || "",
                 dropPoint: pkg.dropPoint || "",
                 transportation: pkg.transportation || "",
                 accommodation: pkg.accommodation || "",
                 meals: pkg.meals || "",
                 bestTime: pkg.bestTime || "",
                 difficulty: pkg.difficulty || "",
                 altitude: pkg.altitude || "",
                 seoTitle: pkg.seoTitle || "",
                 seoDescription: pkg.seoDescription || "",
                 refundPolicy: pkg.refundPolicy || "",
                 cancellationPolicy: pkg.cancellationPolicy || "",
                 paymentTerms: pkg.paymentTerms || ""
              });
           }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [trekId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const payload = {
        ...formData,
        discountedPrice: formData.discountedPrice || null,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };
      
      const { imageUrl, ...prismaData } = payload;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/treks/${trekId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(prismaData)
      });

      if (res.ok) {
        alert("Trek updated successfully!");
        router.push("/admin/treks");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : (type === "number" ? Number(value) : value)
    }));
  };

  if (initialLoading) {
      return <div className="p-8 text-center text-slate-500">Loading trek data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/treks" className="p-2 hover:bg-slate-200 rounded-full transition">
            <ArrowLeft size={24} className="text-slate-600" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Edit Trek</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trek Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL friendly)</label>
              <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
              <input type="text" name="duration" placeholder="e.g. 2 Days / 1 Night" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
              <input type="text" name="difficulty" placeholder="e.g. Easy, Moderate, Difficult" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Altitude</label>
              <input type="text" name="altitude" placeholder="e.g. 5,400 ft" value={formData.altitude} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="e.g. https://example.com/image.jpg" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discounted Price (₹)</label>
              <input type="number" name="discountedPrice" min="0" value={formData.discountedPrice} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination / State</label>
              <select name="destinationId" required value={formData.destinationId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                <option value="">Select Destination</option>
                {(Array.isArray(destinations) ? destinations : []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Point</label>
              <input type="text" name="pickupPoint" value={formData.pickupPoint} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Drop Point</label>
              <input type="text" name="dropPoint" value={formData.dropPoint} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Overview (Short Description)</label>
            <textarea name="overview" required rows={2} value={formData.overview} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
            <textarea name="fullDescription" rows={4} value={formData.fullDescription} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"></textarea>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Refund Policy</label>
                <textarea name="refundPolicy" rows={4} value={formData.refundPolicy} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"></textarea>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Policy</label>
                <textarea name="cancellationPolicy" rows={4} value={formData.cancellationPolicy} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"></textarea>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Terms</label>
                <textarea name="paymentTerms" rows={4} value={formData.paymentTerms} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"></textarea>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 text-primary" />
            <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Feature this trek on the homepage</label>
          </div>

          <div className="pt-4 border-t flex justify-end gap-4">
            <Link href="/admin/treks" className="px-6 py-2 border rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2">
              <Save size={18} /> {loading ? "Updating..." : "Update Trek"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
