// FILE: client/src/components/admin/AdminSectionCard.js

export default function AdminSectionCard({ children }) {
  return (
    <div className="mt-8 bg-white/80 backdrop-blur-md border border-[#BE6E5B]/20 rounded-2xl shadow-[0_8px_30px_rgba(122,61,42,0.04)] p-4 sm:p-6">
      {children}
    </div>
  );
}

