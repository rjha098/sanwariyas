// FILE: client/src/app/privacy/page.js
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyContent from "./PrivacyContent";

export const metadata = {
  title: "Privacy Policy | SANWARIYAS",
  description: "Privacy Policy for SANWARIYAS website, services, and online wholesale platform.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <PrivacyContent />
      <Footer />
    </>
  );
}