import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-bold tracking-wider mb-4 block">
              <span className="text-accent">G</span>owings
            </Link>
            <p className="text-primary-foreground/80 mb-6">
              Your Trusted Travel Partner for Memorable Journeys across India and international destinations.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1KfyJ4HrZ1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition font-bold text-sm">FB</a>
              <a href="https://www.instagram.com/thegowings?utm_source=qr&igsh=MTZqd3NyNHRpOXpmbA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition font-bold text-sm">IG</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition font-bold text-sm">TW</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-primary-foreground/80 hover:text-accent transition">Home</Link></li>
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-accent transition">About Us</Link></li>
              <li><Link href="/packages" className="text-primary-foreground/80 hover:text-accent transition">Packages</Link></li>
              <li><Link href="/destinations" className="text-primary-foreground/80 hover:text-accent transition">Destinations</Link></li>
              <li><Link href="/custom-trip" className="text-primary-foreground/80 hover:text-accent transition">Custom Trips</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/80 hover:text-accent transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-primary-foreground/80">
                <MapPin className="shrink-0 text-accent" />
                <span>Ravi Mill Colony, P B Road, Davanagere - 577003, Karnataka, India</span>
              </li>
              <li className="flex gap-3 text-primary-foreground/80 items-center">
                <Phone className="shrink-0 text-accent" />
                <span>+91 9108620564<br/>+91 9108544923</span>
              </li>
              <li className="flex gap-3 text-primary-foreground/80 items-center">
                <Mail className="shrink-0 text-accent" />
                <span>thegowings26@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Newsletter</h3>
            <p className="text-primary-foreground/80 mb-4">Subscribe to get the latest travel updates and offers.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-md focus:outline-none focus:border-accent"
              />
              <button className="bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-md hover:bg-accent/90 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Gowings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
