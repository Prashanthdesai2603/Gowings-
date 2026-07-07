"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditTripPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    overview: "",
    price: 0,
    isFeatured: false,
    categoryId: "",
    destinationId: "",
    imageUrl: ""
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
    seoTitle: "",
    seoDescription: "",
    cancellationPolicy: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const destRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations`);
        if (catRes.ok) setCategories(await catRes.json());
        if (destRes.ok) setDestinations(await destRes.json());

        const tripsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips?limit=1000`);
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          const trips = tripsData.data || tripsData;
          const trip = trips.find((t: any) => t.id === id);
          if (trip) {
            setFormData({
              title: trip.title || "",
              slug: trip.slug || "",
              overview: trip.overview || "",
              price: trip.price || 0,
              isFeatured: trip.isFeatured || false,
              categoryId: trip.categoryId || "",
              destinationId: trip.destinationId || "",
              imageUrl: trip.images?.[0] || "",
              duration: trip.duration || "",
              startingCity: trip.startingCity || "",
              fullDescription: trip.fullDescription || "",
              pickupPoint: trip.pickupPoint || "",
              dropPoint: trip.dropPoint || "",
              transportation: trip.transportation || "",
              accommodation: trip.accommodation || "",
              meals: trip.meals || "",
              bestTime: trip.bestTime || "",
              difficulty: trip.difficulty || "",
              seoTitle: trip.seoTitle || "",
              seoDescription: trip.seoDescription || "",
              cancellationPolicy: trip.cancellationPolicy || ""
            });
          } else {
            alert("Trip not found");
            router.push("/admin/trips");
          }
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const payload = {
        ...formData,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };
      
      const { imageUrl, ...prismaData } = payload;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(prismaData)
      });

      if (res.ok) {
        alert("Trip updated successfully!");
        router.push("/admin/trips");
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

  if (fetching) {
    return <div className="p-8 text-center text-slate-500">Loading trip details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/trips" className="p-2 hover:bg-slate-200 rounded-full transition">
            <ArrowLeft size={24} className="text-slate-600" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Edit Trip</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trip Title</label>
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
              <input type="text" name="duration" placeholder="e.g. 3 Days / 2 Nights" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Starting City</label>
              <input type="text" name="startingCity" value={formData.startingCity} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
              <input type="text" name="difficulty" placeholder="e.g. Easy, Moderate" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <select name="destinationId" required value={formData.destinationId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                <option value="">Select Destination</option>
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 text-primary" />
            <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Feature this trip on the homepage</label>
          </div>

          <div className="pt-4 border-t flex justify-end gap-4">
            <Link href="/admin/trips" className="px-6 py-2 border rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2">
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
