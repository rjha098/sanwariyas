// FILE: client/src/app/privacy/page.js
import Footer from "@/components/layout/Footer";
import PrivacyContent from "./PrivacyContent";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Privacy Policy | SANWARIYAS",
  description: "Privacy Policy for SANWARIYAS website, services, and online wholesale platform.",
};

export default function PrivacyPolicy() {
  return (
    <>
      {/* <Navbar /> */}
      <PrivacyContent /> 
      <Footer />
    </>
  );
}


