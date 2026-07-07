import HeroSection from "@/components/home/HeroSection";
import FeaturedPackages from "@/components/home/FeaturedPackages";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">

      <HeroSection />

      {/* Featured Packages Module */}
      <FeaturedPackages />

      {/* Other sections will be integrated here */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">More sections coming soon!</h2>
        <p className="text-muted-foreground">The development is currently in progress. This serves as the initial architectural setup.</p>
      </section>

    </main>
  );
}
