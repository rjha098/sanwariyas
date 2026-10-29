// // FILE: client/src/components/admin/InquiryTable.js

// "use client";

// import { formatPhone } from "@/utils/formatPhone";
// import { useRouter } from "next/navigation";
// import { buildInquiryDetailHref } from "@/lib/adminRoutes";

// const STATUS_COLORS = {
//   pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//   contacted: "bg-blue-100 text-blue-800 border-blue-300",
//   resolved: "bg-green-100 text-green-800 border-green-300",
// };

// export default function InquiryTable({
//   inquiries,
//   inquiriesLoading,
//   inquiryPagination,
//   inquiryPage,
//   setInquiryPage,
//   inquiryFilter,
//   setInquiryFilter,
//   inquiryMessage,
//   handleInquiryStatus,
//   deleteInquiry,
//   markAsViewed,
//   highlightedInquiryId,
// }) {
//   const router = useRouter();

//   const handleViewDetails = async (inquiryId, isUnread) => {
//     if (isUnread && markAsViewed) {
//       await markAsViewed(inquiryId);
//     }
//     // Carry the current filter/page to the detail route so its Back button can
//     // return to this exact list state (no router.back()/sessionStorage needed).
//     router.push(
//       buildInquiryDetailHref(inquiryId, {
//         status: inquiryFilter,
//         page: inquiryPage,
//       }),
//     );
//   };

//   return (
//     <section
//       aria-label="Inquiry Management"
//       className="bg-white border border-brand-lightgold/50 shadow-sm p-6"
//     >
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div>
//           <p
//             className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2"
//             aria-hidden="true"
//           >
//             Customer Desk
//           </p>
//           <h2 className="font-display text-2xl">Manage Inquiries</h2>
//         </div>

//         <div
//           className="flex flex-wrap gap-2"
//           role="group"
//           aria-label="Filter inquiries by status"
//         >
//           {["", "pending", "contacted", "resolved"].map((status) => (
//             <button
//               key={status || "all"}
//               onClick={() => {
//                 setInquiryFilter(status);
//                 setInquiryPage(1);
//               }}
//               aria-pressed={inquiryFilter === status}
//               aria-label={`Filter by ${status || "All"}`}
//               className={`px-4 py-2 font-sans text-xs tracking-[0.25em] uppercase border ${
//                 inquiryFilter === status
//                   ? "bg-brand-coffee text-brand-cream border-brand-coffee"
//                   : "border-brand-lightgold/60 text-brand-mud hover:bg-gray-50 transition-colors"
//               }`}
//             >
//               {status || "All"}
//             </button>
//           ))}
//         </div>
//       </div>

//       {inquiryMessage && (
//         <p
//           aria-live="polite"
//           role="status"
//           className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3 mb-4"
//         >
//           {inquiryMessage}
//         </p>
//       )}

//       {inquiriesLoading ? (
//         <div
//           className="py-16 text-center font-sans text-sm text-brand-mud/60"
//           aria-live="polite"
//           aria-busy="true"
//         >
//           Loading inquiries...
//         </div>
//       ) : inquiries.length === 0 ? (
//         <div
//           className="py-16 text-center font-sans text-sm text-brand-mud/60"
//           aria-live="polite"
//         >
//           No inquiries found.
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table
//             className="w-full min-w-[1000px]"
//             aria-label="Customer Inquiries Table"
//           >
//             <thead className="border-b border-brand-lightgold/60">
//               <tr>
//                 {[
//                   "Customer",
//                   "Contact",
//                   "Product",
//                   "Message",
//                   "Status",
//                   "Customer Status",
//                   "Date",
//                   "Actions",
//                 ].map((heading) => (
//                   <th
//                     key={heading}
//                     scope="col"
//                     className="text-left py-3 pr-4 font-sans text-[10px] tracking-[0.25em] uppercase text-brand-mud/70"
//                   >
//                     {heading}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-brand-lightgold/40">
//               {inquiries.map((inquiry) => {
//                 const isUnread = !inquiry.isViewedByAdmin;

//                 // ✅ FIX: Customer ka unread reply check karo
//                 const hasUnreadReply = inquiry.replies?.some(
//                   (r) => r.role === "customer" && r.isReadByAdmin === false,
//                 );

//                 return (
//                   <tr
//                     key={inquiry._id}
//                     className={`transition-colors ${
//                       highlightedInquiryId === inquiry._id
//                         ? "bg-[#FEF9F0] border-l-4 border-l-[#C9A84C] shadow-sm"
//                         : isUnread
//                           ? "bg-orange-50/50 hover:bg-gray-50"
//                           : "hover:bg-gray-50"
//                     }`}
//                   >
//                     <td className="py-4 pr-4 font-sans text-sm font-medium">
//                       {/* NEW / SEEN badge */}
//                       {isUnread ? (
//                         <span className="inline-block bg-red-500 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm mr-2 align-middle">
//                           NEW
//                         </span>
//                       ) : (
//                         <span className="inline-block bg-gray-200 text-gray-500 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm mr-2 align-middle">
//                           SEEN
//                         </span>
//                       )}

//                       {/*  FIX: Green NEW REPLY badge — customer ne dobara reply kiya */}
//                       {hasUnreadReply && (
//                         <span
//                           title="New customer reply received"
//                           className="inline-flex items-center gap-1 bg-green-100 text-green-700 border border-green-300 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm mr-2 align-middle"
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
//                           NEW REPLY
//                         </span>
//                       )}

//                       <span className="align-middle">{inquiry.name}</span>
//                     </td>
//                     <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
//                       <p>{inquiry.email}</p>
//                       <p className="text-brand-mud/60 mt-1">
//                         {formatPhone(inquiry.whatsapp)}{" "}
//                       </p>
//                     </td>

//                     <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
//                       {inquiry.productName || "General inquiry"}
//                     </td>

//                     <td className="py-4 pr-4 font-sans text-xs text-brand-mud max-w-[260px]">
//                       <p className="max-h-16 overflow-hidden">
//                         {inquiry.message}
//                       </p>
//                       {inquiry.sampleImages?.length > 0 && (
//                         <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#FAF3E8] border border-[#E8D5A3] text-[10px] font-bold text-[#7A3D2A]">
//                           📷 {inquiry.sampleImages.length} image
//                           {inquiry.sampleImages.length > 1 ? "s" : ""}
//                         </span>
//                       )}
//                     </td>

//                     <td className="py-4 pr-4">
//                       <span
//                         className={`inline-block font-sans text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border rounded-full ${
//                           STATUS_COLORS[inquiry.status] ||
//                           "bg-gray-100 text-gray-700 border-gray-300"
//                         }`}
//                       >
//                         {inquiry.status}
//                       </span>
//                     </td>
//                     <td className="py-4 pr-4">
//                       {inquiry.isCustomerOnline ? (
//                         <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase">
//                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                           Online
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase">
//                           <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
//                           Offline
//                         </span>
//                       )}
//                     </td>
//                     <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
//                       {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </td>

//                     <td className="py-4 pr-4">
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           onClick={() =>
//                             handleViewDetails(inquiry._id, isUnread)
//                           }
//                           aria-label={`View details for ${inquiry.name}`}
//                           className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-brand-coffee text-brand-coffee hover:bg-brand-coffee hover:text-white transition-colors"
//                         >
//                           View
//                         </button>

//                         {inquiry.status !== "contacted" && (
//                           <button
//                             onClick={() =>
//                               handleInquiryStatus(inquiry._id, "contacted")
//                             }
//                             aria-label={`Mark inquiry from ${inquiry.name} as contacted`}
//                             className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
//                           >
//                             Contact
//                           </button>
//                         )}

//                         {inquiry.status !== "resolved" && (
//                           <button
//                             onClick={() =>
//                               handleInquiryStatus(inquiry._id, "resolved")
//                             }
//                             aria-label={`Mark inquiry from ${inquiry.name} as resolved`}
//                             className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-green-200 text-green-700 hover:bg-green-50 transition-colors"
//                           >
//                             Resolve
//                           </button>
//                         )}

//                         {deleteInquiry && (
//                           <button
//                             onClick={() => deleteInquiry(inquiry._id)}
//                             aria-label={`Delete inquiry from ${inquiry.name}`}
//                             className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
//                           >
//                             Delete
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {inquiryPagination?.pages > 1 && (
//         <nav
//           aria-label="Inquiries pagination"
//           className="flex flex-wrap gap-2 mt-6"
//         >
//           {Array.from(
//             { length: inquiryPagination?.pages || 0 },
//             (_, index) => index + 1,
//           ).map((pg) => (
//             <button
//               key={pg}
//               onClick={() => setInquiryPage(pg)}
//               aria-current={pg === inquiryPage ? "page" : undefined}
//               aria-label={`Go to page ${pg}`}
//               className={`w-10 h-10 font-sans text-xs hover:bg-brand-parchment transition-colors ${
//                 pg === inquiryPage
//                   ? "bg-brand-coffee text-brand-cream"
//                   : "border border-brand-lightgold/60 text-brand-mud"
//               }`}
//             >
//               {pg}
//             </button>
//           ))}
//         </nav>
//       )}
//     </section>
//   );
// }

// FILE: client/src/components/admin/InquiryTable.js

"use client";

import { formatPhone } from "@/utils/formatPhone";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildInquiryDetailHref } from "@/lib/adminRoutes";
import { Icon } from "@/components/admin/InquiryIcons";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  contacted: "bg-blue-100 text-blue-800 border-blue-300",
  resolved: "bg-green-100 text-green-800 border-green-300",
};

const isResolvedStatus = (status) => ["resolved", "Closed"].includes(status);
const shortDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

export default function InquiryTable({
  inquiries,
  inquiriesLoading,
  inquiryPagination,
  inquiryPage,
  setInquiryPage,
  inquiryFilter,
  setInquiryFilter,
  inquiryMessage,
  handleInquiryStatus,
  deleteInquiry,
  markAsViewed,
  highlightedInquiryId,
  exportInquiries,
  exporting = false,
}) {
  const router = useRouter();
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");

  const handleViewDetails = async (
    inquiryId,
    isUnread,
    { focusLog = false } = {},
  ) => {
    if (isUnread && markAsViewed) {
      await markAsViewed(inquiryId);
    }
    // Carry the current filter/page to the detail route so its Back button can
    // return to this exact list state (no router.back()/sessionStorage needed).
    router.push(
      buildInquiryDetailHref(inquiryId, {
        status: inquiryFilter,
        page: inquiryPage,
        focusLog,
      }),
    );
  };

  return (
    <section
      aria-label="Inquiry Management"
      className="bg-white border border-brand-lightgold/50 shadow-sm p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p
            className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2"
            aria-hidden="true"
          >
            Customer Desk
          </p>
          <h2 className="font-display text-2xl">Manage Inquiries</h2>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter inquiries by status"
        >
          {["", "pending", "contacted", "resolved"].map((status) => (
            <button
              key={status || "all"}
              onClick={() => {
                setInquiryFilter(status);
                setInquiryPage(1);
              }}
              aria-pressed={inquiryFilter === status}
              aria-label={`Filter by ${status || "All"}`}
              className={`px-4 py-2 font-sans text-xs tracking-[0.25em] uppercase border ${
                inquiryFilter === status
                  ? "bg-brand-coffee text-brand-cream border-brand-coffee"
                  : "border-brand-lightgold/60 text-brand-mud hover:bg-gray-50 transition-colors"
              }`}
            >
              {status || "All"}
            </button>
          ))}
        </div>
      </div>

      {exportInquiries && (
        <div className="flex flex-wrap items-end gap-3 mb-6 p-4 bg-brand-parchment border border-brand-lightgold/60">
          <div className="mr-auto">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold">
              Export to Excel
            </p>
            <p className="font-sans text-xs text-brand-mud/70 mt-1">
              One file with New, Contacted and Resolved sheets + contact notes.
            </p>
          </div>
          <label className="font-sans text-[10px] tracking-widest uppercase text-brand-mud/70">
            From
            <input
              type="date"
              value={exportFrom}
              max={exportTo || undefined}
              onChange={(e) => setExportFrom(e.target.value)}
              className="block mt-1 p-2 border border-brand-lightgold/60 bg-white text-sm normal-case tracking-normal text-brand-mud"
            />
          </label>
          <label className="font-sans text-[10px] tracking-widest uppercase text-brand-mud/70">
            To
            <input
              type="date"
              value={exportTo}
              min={exportFrom || undefined}
              onChange={(e) => setExportTo(e.target.value)}
              className="block mt-1 p-2 border border-brand-lightgold/60 bg-white text-sm normal-case tracking-normal text-brand-mud"
            />
          </label>
          <button
            type="button"
            disabled={exporting}
            onClick={() => exportInquiries({ from: exportFrom, to: exportTo })}
            className="px-5 py-2.5 bg-green-700 text-white font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {exporting ? "Preparing..." : "Download Excel"}
          </button>
        </div>
      )}

      {inquiryMessage && (
        <p
          aria-live="polite"
          role="status"
          className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3 mb-4"
        >
          {inquiryMessage}
        </p>
      )}

      {inquiriesLoading ? (
        <div
          className="py-16 text-center font-sans text-sm text-brand-mud/60"
          aria-live="polite"
          aria-busy="true"
        >
          Loading inquiries...
        </div>
      ) : inquiries.length === 0 ? (
        <div
          className="py-16 text-center font-sans text-sm text-brand-mud/60"
          aria-live="polite"
        >
          No inquiries found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[1000px]"
            aria-label="Customer Inquiries Table"
          >
            <thead className="border-b border-brand-lightgold/60">
              <tr>
                {[
                  "Customer",
                  "Contact",
                  "Product",
                  "Message",
                  "Status",
                  "Customer Status",
                  "Date",
                  "Actions",
                ].map((heading) => (
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
              {inquiries.map((inquiry) => {
                const isUnread = !inquiry.isViewedByAdmin;

                // ✅ FIX: Customer ka unread reply check karo
                const hasUnreadReply = inquiry.replies?.some(
                  (r) => r.role === "customer" && r.isReadByAdmin === false,
                );

                return (
                  <tr
                    key={inquiry._id}
                    className={`transition-colors ${
                      highlightedInquiryId === inquiry._id
                        ? "bg-[#FEF9F0] border-l-4 border-l-[#C9A84C] shadow-sm"
                        : isUnread
                          ? "bg-orange-50/50 hover:bg-gray-50"
                          : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-4 pr-4 font-sans text-sm font-medium">
                      {/* NEW / SEEN badge */}
                      {isUnread ? (
                        <span className="inline-block bg-red-500 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm mr-2 align-middle">
                          NEW
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-200 text-gray-500 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm mr-2 align-middle">
                          SEEN
                        </span>
                      )}

                      {/*  FIX: Green NEW REPLY badge — customer ne dobara reply kiya */}
                      {hasUnreadReply && (
                        <span
                          title="New customer reply received"
                          className="inline-flex items-center gap-1 bg-green-100 text-green-700 border border-green-300 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm mr-2 align-middle"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                          NEW REPLY
                        </span>
                      )}

                      <span className="align-middle">{inquiry.name}</span>
                    </td>
                    <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
                      <p>{inquiry.email}</p>
                      <p className="text-brand-mud/60 mt-1">
                        {formatPhone(inquiry.whatsapp)}{" "}
                      </p>
                    </td>

                    <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
                      {inquiry.productName || "General inquiry"}
                    </td>

                    <td className="py-4 pr-4 font-sans text-xs text-brand-mud max-w-[260px]">
                      <p className="max-h-16 overflow-hidden">
                        {inquiry.message}
                      </p>
                      
                      {inquiry.sampleImages?.length > 0 && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#FAF3E8] border border-[#E8D5A3] text-[10px] font-bold text-[#7A3D2A]">
                          📷 {inquiry.sampleImages.length} image
                          {inquiry.sampleImages.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>

                    <td className="py-4 pr-4">
                      <span
                        className={`inline-block font-sans text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border rounded-full ${
                          STATUS_COLORS[inquiry.status] ||
                          "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                      {inquiry.lastContactedAt && (
                        <p className="font-sans text-[10px] text-brand-mud/60 mt-1.5">
                          Last contact: {shortDate(inquiry.lastContactedAt)}
                        </p>
                      )}
                      {inquiry.nextFollowUpAt &&
                        !isResolvedStatus(inquiry.status) && (
                          <p
                            className={`inline-block font-sans text-[10px] font-semibold mt-1 px-2 py-0.5 border rounded-sm ${
                              new Date(inquiry.nextFollowUpAt).getTime() <=
                              Date.now()
                                ? "bg-red-50 text-red-700 border-red-300"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {new Date(inquiry.nextFollowUpAt).getTime() <=
                            Date.now()
                              ? "⏰ Follow-up due "
                              : "📅 Follow-up "}
                            {shortDate(inquiry.nextFollowUpAt)}
                          </p>
                        )}
                    </td>
                    <td className="py-4 pr-4">
                      {inquiry.isCustomerOnline ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleViewDetails(inquiry._id, isUnread)
                          }
                          aria-label={`View details for ${inquiry.name}`}
                          className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-brand-coffee text-brand-coffee hover:bg-brand-coffee hover:text-white transition-colors"
                        >
                          View
                        </button>

                        {/* Opens the detail page at the private contact log; saving a
                            note there also moves a New inquiry to Contacted. */}
                        {!isResolvedStatus(inquiry.status) && (
                          <button
                            onClick={() =>
                              handleViewDetails(inquiry._id, isUnread, {
                                focusLog: true,
                              })
                            }
                            aria-label={`Add contact note for ${inquiry.name}`}
                            className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            {inquiry.status === "pending" ||
                            inquiry.status === "New"
                              ? "Contact"
                              : "Add Note"}
                          </button>
                        )}

                        {inquiry.status !== "resolved" && (
                          <button
                            onClick={() =>
                              handleInquiryStatus(inquiry._id, "resolved")
                            }
                            aria-label={`Mark inquiry from ${inquiry.name} as resolved`}
                            className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-green-200 text-green-700 hover:bg-green-50 transition-colors"
                          >
                            Resolve
                          </button>
                        )}

                        {deleteInquiry && (
                          <button
                            onClick={() => deleteInquiry(inquiry._id)}
                            aria-label={`Delete inquiry from ${inquiry.name}`}
                            className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {inquiryPagination?.pages > 1 && (
        <nav
          aria-label="Inquiries pagination"
          className="flex flex-wrap gap-2 mt-6"
        >
          {Array.from(
            { length: inquiryPagination?.pages || 0 },
            (_, index) => index + 1,
          ).map((pg) => (
            <button
              key={pg}
              onClick={() => setInquiryPage(pg)}
              aria-current={pg === inquiryPage ? "page" : undefined}
              aria-label={`Go to page ${pg}`}
              className={`w-10 h-10 font-sans text-xs hover:bg-brand-parchment transition-colors ${
                pg === inquiryPage
                  ? "bg-brand-coffee text-brand-cream"
                  : "border border-brand-lightgold/60 text-brand-mud"
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
