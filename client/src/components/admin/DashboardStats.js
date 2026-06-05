export default function DashboardStats({ productsTotal, featuredTotal, openInquiriesTotal, resolvedInquiriesTotal }) {
  const stats = [
    { label: 'Products', value: productsTotal, tone: 'bg-brand-african text-white' },
    { label: 'Featured', value: featuredTotal, tone: 'bg-brand-coffee text-white' },
    { label: 'Open Inquiries', value: openInquiriesTotal, tone: 'bg-yellow-600 text-white' },
    { label: 'Resolved', value: resolvedInquiriesTotal, tone: 'bg-green-700 text-white' },
  ];

  return (
    <section aria-label="Quick Stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div key={item.label} className={`${item.tone} p-5 shadow-sm`} role="status" aria-atomic="true">
          <p className="font-sans text-3xl mb-1">{item.value}</p>
          <p className="font-sans text-xs tracking-[0.3em] uppercase opacity-80">{item.label}</p>
        </div>
      ))}
    </section>
  );
}