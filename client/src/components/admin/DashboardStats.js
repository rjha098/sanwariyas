// // FILE: client/src/components/admin/DashboardStats.js
// export default function DashboardStats({
//   productsTotal,
//   featuredTotal,
//   openInquiriesTotal,
//   resolvedInquiriesTotal,
//   countdown
// }) {
//   const stats = [
//     { label: 'Products', value: productsTotal, tone: 'bg-brand-african text-white' },
//     { label: 'Featured', value: featuredTotal, tone: 'bg-brand-coffee text-white' },
//     { label: 'Open Inquiries', value: openInquiriesTotal, tone: 'bg-yellow-600 text-white' },
//     { label: 'Resolved', value: resolvedInquiriesTotal, tone: 'bg-green-700 text-white' },

//     { label: 'Next Sync', value: `${countdown}s`, tone: 'bg-slate-700 text-white' },
//   ];

//   return (

//     <section aria-label="Quick Stats" className="grid grid-cols-2 lg:grid-cols-5 gap-4">
//       {stats.map((item) => (
//         <div key={item.label} className={`${item.tone} p-5 shadow-sm`} role="status" aria-atomic="true">
//           <p className="font-sans text-3xl mb-1">{item.value}</p>
//           <p className="font-sans text-xs tracking-[0.3em] uppercase opacity-80">{item.label}</p>
//         </div>
//       ))}
//     </section>
//   );
// }


// FILE: client/src/components/admin/DashboardStats.js
export default function DashboardStats({
  productsTotal,
  featuredTotal,
  openInquiriesTotal,
  resolvedInquiriesTotal,
  countdown,
}) {
  // Sanwariyas Theme: 5 Different but Earthy Colors (Terracotta, Mustard, Olive, Slate, Coffee)
  const stats = [
    {
      label: "Products",
      value: productsTotal,
      tone: "bg-gradient-to-br from-[#BE6E5B] to-[#A65646] shadow-md shadow-[#BE6E5B]/20",
    },
    {
      label: "Featured",
      value: featuredTotal,
      tone: "bg-gradient-to-br from-[#D4A373] to-[#B88655] shadow-md shadow-[#D4A373]/20",
    },
    {
      label: "Open Inquiries",
      value: openInquiriesTotal,
      tone: "bg-gradient-to-br from-[#8A9A5B] to-[#6B7B43] shadow-md shadow-[#8A9A5B]/20",
    },
    {
      label: "Resolved",
      value: resolvedInquiriesTotal,
      tone: "bg-gradient-to-br from-[#708090] to-[#536878] shadow-md shadow-[#708090]/20",
    },
    {
      label: "Next Sync",
      value: `${countdown}s`,
      tone: "bg-gradient-to-br from-[#8B5A2B] to-[#6F4518] shadow-lg shadow-[#8B5A2B]/40 ring-2 ring-offset-2 ring-offset-[#FAF3E8] ring-[#8B5A2B] animate-pulse relative overflow-hidden",
      isHighlight: true,
    },
  ];

  return (
    <section
      aria-label="Quick Stats"
      className="grid grid-cols-2 lg:grid-cols-5 gap-4"
    >
      {stats.map((item) => (
        <div
          key={item.label}
          className={`${item.tone} p-5 rounded-xl text-white transition-transform duration-300 hover:-translate-y-1 flex flex-col justify-center`}
          role="status"
          aria-atomic="true"
        >
          {item.isHighlight && (
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          )}
          
          <p className="text-white/80 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase mb-1.5 relative z-10">
            {item.label}
          </p>
          <p className="text-2xl sm:text-3xl font-display font-bold drop-shadow-sm relative z-10">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}