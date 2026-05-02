import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ✅ TECHNICAL SEO: Added Next.js metadata for Search Engine ranking
export const metadata = {
  title: "About Us | SANWARIYAS - Premium Ethnic Luxury",
  description: "Discover the story of SANWARIYAS, a premium ethnic fashion brand blending timeless elegance with modern craftsmanship. Explore our heritage and artistry.",
  keywords: "SANWARIYAS, ethnic fashion, premium quality, custom designs, bridal lehengas, Indian luxury wear, ethnic brand story",
};

export default function AboutPage() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* ✅ ACCESSIBILITY & SEO: Changed <section> to <main> for semantic structure */}
      <main
        id="main-content"
        className="min-h-screen pt-36 py-28 relative"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.7em] uppercase text-[#7A3D2A] font-semibold mb-4">
            Our Story
          </p>

          <h1 className="text-5xl md:text-6xl text-[#7A3D2A] mb-6 font-serif">
            About SANWARIYAS
          </h1>

          {/* ✅ ACCESSIBILITY: Added aria-hidden="true" so screen readers ignore decorative lines/symbols */}
          <div className="flex items-center justify-center gap-4 mb-12" aria-hidden="true">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <span className="text-[#BE6E5B] text-lg">✦</span>
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>

          <p className="text-[#7A3D2A] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            SANWARIYAS is a premium ethnic fashion brand dedicated to bringing
            timeless elegance and modern craftsmanship together. From bridal
            lehengas to everyday luxury wear, each piece reflects heritage,
            artistry, and sophistication.
          </p>

          <p className="text-[#7A3D2A] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-16">
            We believe in creating not just garments, but experiences — helping
            you look your best for every occasion.
          </p>

          {/* Features Grid */}
          <section aria-label="Our Core Values" className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="p-6 bg-white/70 border border-[#BE6E5B]/20 rounded-sm shadow-sm backdrop-blur-sm">
              {/* ✅ ACCESSIBILITY: Changed <h3> to <h2> to maintain strict heading hierarchy (h1 -> h2) */}
              <h2 className="text-[#7A3D2A] text-xl mb-2 font-semibold">
                Premium Quality
              </h2>
              <p className="text-[#a07f61] text-sm font-medium">
                Finest fabrics and detailed craftsmanship.
              </p>
            </div>

            <div className="p-6 bg-white/70 border border-[#BE6E5B]/20 rounded-sm shadow-sm backdrop-blur-sm">
              <h2 className="text-[#7A3D2A] text-xl mb-2 font-semibold">
                Custom Designs
              </h2>
              <p className="text-[#a07f61] text-sm font-medium">
                Tailored outfits for your perfect fit.
              </p>
            </div>

            <div className="p-6 bg-white/70 border border-[#BE6E5B]/20 rounded-sm shadow-sm backdrop-blur-sm">
              <h2 className="text-[#7A3D2A] text-xl mb-2 font-semibold">
                Trusted Brand
              </h2>
              <p className="text-[#a07f61] text-sm font-medium">
                Loved by customers for quality & service.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}