// FILE: client/src/app/not-found.js
import Link from "next/link";
// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

//  SEO FIX: Updated title to align with B2B Wholesale identity
export const metadata = {
  title: "Page Not Found | SANWARIYAS Wholesale",
  description:
    "The page you are looking for does not exist. Explore our premium ethnic wear collections instead.",
  robots: {
    index: false, 
    follow: true, 
  },
};

export default function NotFound() {
  return (
    <>
      {/* <Navbar /> */}

      {/*  A11Y: Added id="main-content" for "skip to content" functionality */}
      <main
        id="main-content"
        className="min-h-screen bg-[#FDF7F2] flex items-center justify-center px-4"
      >
        <div className="text-center max-w-lg">
          {/* ✅ A11Y: Hidden the giant "404" text from screen readers */}
          <p
            aria-hidden="true"
            className="font-display text-9xl text-[#C9A84C]/20 leading-none mb-6"
          >
            404
          </p>

          <h1 className="font-display text-3xl text-[#574325] mb-4">
            Page Not Found
          </h1>

          <p className="font-sans text-sm text-[#a07f61] mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let us
            help you find what you're looking for.
          </p>

          <nav
            aria-label="Error page navigation"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* ✅ SEO FIX: Added Title attributes to pass context back to the site */}
            <Link
              href="/"
              title="Return to SANWARIYAS Homepage"
              className="px-8 py-3 bg-[#7A3D2A] text-[#FDF7F2] rounded hover:bg-[#BE6E5B] transition-all"
              aria-label="Return to the homepage"
            >
              Go Home
            </Link>

            <Link
              href="/products"
              title="Browse Wholesale Ethnic Wear Catalog"
              className="px-8 py-3 border border-[#7A3D2A] text-[#7A3D2A] rounded hover:bg-[#7A3D2A] hover:text-[#FDF7F2] transition-all"
              aria-label="View all product collections"
            >
              View Collections
            </Link>
          </nav>
        </div>
      </main>

      <Footer />
    </>
  );
}