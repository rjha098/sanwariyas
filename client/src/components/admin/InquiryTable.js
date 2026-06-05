const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  contacted: 'bg-blue-100 text-blue-800 border-blue-300',
  resolved: 'bg-green-100 text-green-800 border-green-300',
};

export default function InquiryTable({
  inquiries, inquiriesLoading, inquiryPagination, inquiryPage, setInquiryPage,
  inquiryFilter, setInquiryFilter, inquiryMessage, handleInquiryStatus
}) {
  return (
    <section aria-label="Inquiry Management" className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2" aria-hidden="true">Customer Desk</p>
          <h2 className="font-display text-2xl">Manage Inquiries</h2>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter inquiries by status">
          {['', 'pending', 'contacted', 'resolved'].map((status) => (
            <button
              key={status || 'all'}
              onClick={() => {
                setInquiryFilter(status);
                setInquiryPage(1);
              }}
              aria-pressed={inquiryFilter === status}
              aria-label={`Filter by ${status || 'All'}`}
              className={`px-4 py-2 font-sans text-xs tracking-[0.25em] uppercase border ${
                inquiryFilter === status
                  ? 'bg-brand-coffee text-brand-cream border-brand-coffee'
                  : 'border-brand-lightgold/60 text-brand-mud'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
      </div>

      {inquiryMessage && (
        <p aria-live="polite" role="status" className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3 mb-4">
          {inquiryMessage}
        </p>
      )}

      {inquiriesLoading ? (
        <div className="py-16 text-center font-sans text-sm text-brand-mud/60" aria-live="polite" aria-busy="true">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="py-16 text-center font-sans text-sm text-brand-mud/60" aria-live="polite">No inquiries found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px]" aria-label="Customer Inquiries Table">
            <thead className="border-b border-brand-lightgold/60">
              <tr>
                {['Customer', 'Contact', 'Product', 'Message', 'Status', 'Date', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="text-left py-3 pr-4 font-sans text-[10px] tracking-[0.25em] uppercase text-brand-mud/70"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-lightgold/40">
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id}>
                  <td className="py-4 pr-4 font-sans text-sm">{inquiry.name}</td>
                  <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
                    <p>{inquiry.email}</p>
                    <p className="text-brand-mud/60 mt-1">{inquiry.whatsapp}</p>
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
                    {inquiry.productName || 'General inquiry'}
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-brand-mud max-w-[260px]">
                    <p className="max-h-16 overflow-hidden">{inquiry.message}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`inline-block font-sans text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border rounded-full ${STATUS_COLORS[inquiry.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
                    {new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-2">
                      {inquiry.status !== 'contacted' && (
                        <button
                          onClick={() => handleInquiryStatus(inquiry._id, 'contacted')}
                          aria-label={`Mark inquiry from ${inquiry.name} as contacted`}
                          className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-blue-200 text-blue-700"
                        >
                          Contacted
                        </button>
                      )}
                      {inquiry.status !== 'resolved' && (
                        <button
                          onClick={() => handleInquiryStatus(inquiry._id, 'resolved')}
                          aria-label={`Mark inquiry from ${inquiry.name} as resolved`}
                          className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-green-200 text-green-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {inquiryPagination.pages > 1 && (
        <nav aria-label="Inquiries pagination" className="flex flex-wrap gap-2 mt-6">
          {Array.from({ length: inquiryPagination.pages }, (_, index) => index + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setInquiryPage(pg)}
              aria-current={pg === inquiryPage ? 'page' : undefined}
              aria-label={`Go to page ${pg}`}
              className={`w-10 h-10 font-sans text-xs ${
                pg === inquiryPage
                  ? 'bg-brand-coffee text-brand-cream'
                  : 'border border-brand-lightgold/60 text-brand-mud'
              }`}
            >
              {pg}
            </button>
          ))}
        </nav>
      )}
    </section>
  );
}