// FILE: client/src/app/faq/page.js
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqSection from "@/components/home/FaqSection";

export const metadata = {
  title: "FAQ - Sanwariyas",
  description: "Frequently Asked Questions about Sanwariyas global wholesale, custom production, and shipping.",
};

export default function FaqPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FDF7F2]">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Main FAQ Section (Padding added to account for Navbar height) */}
      <div className="flex-grow pt-20">
        <FaqSection />
      </div>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}