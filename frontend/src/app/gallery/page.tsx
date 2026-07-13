import fs from 'fs';
import path from 'path';
import GalleryGrid from './GalleryGrid';

export const metadata = {
  title: 'Gallery | Gowings',
  description: 'Explore the beautiful moments captured during our trips.',
};

export default async function GalleryPage() {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');
  let files: string[] = [];

  try {
    if (fs.existsSync(galleryDir)) {
      files = fs.readdirSync(galleryDir);
    }
  } catch (error) {
    console.error("Failed to read gallery directory", error);
  }

  // Filter for common media types and map to their public URLs
  const mediaItems = files
    .filter(file => /\.(jpg|jpeg|png|mp4)$/i.test(file))
    .map(file => ({
      url: `/gallery/${file}`,
      type: file.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
      filename: file
    }));

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-50 text-accent px-4 py-1.5 rounded-full mb-6 border border-blue-100">
            <span className="text-sm font-bold tracking-wide uppercase">Memories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-slate-800 tracking-tight">Our Gallery</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Take a glimpse into the incredible journeys and unforgettable moments shared with our travelers.
          </p>
        </div>

        {mediaItems.length > 0 ? (
          <GalleryGrid items={mediaItems} />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No media found</h3>
            <p className="text-slate-500 font-medium">We are still curating our best moments. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
