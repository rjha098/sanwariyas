// FILE: client/src/app/operations-center/layout.js

// ✅ SEO APPROVED: Strict noindex/nofollow directives are perfectly implemented for this private admin route.
export const metadata = {
  title: "Operations Center | SANWARIYAS",
  description: "Secure administrative dashboard for SANWARIYAS wholesale management.",
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

export default function OperationsCenterLayout({ children }) {
  return (
    <div className="admin-wrapper bg-[#f8f4ec] min-h-screen">
      {children}
    </div>
  );
}