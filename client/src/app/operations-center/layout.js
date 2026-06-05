// FILE: client/src/app/admin/layout.js

export const metadata = {
  title: "Admin Panel | SANWARIYAS",
  description: "Secure administrative dashboard for SANWARIYAS wholesale management.",
  // ✅ CRITICAL FIX: Yeh robots tag Google ko is page ko index karne se rokega
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-wrapper bg-[#f8f4ec] min-h-screen">
      {children}
    </div>
  );
}