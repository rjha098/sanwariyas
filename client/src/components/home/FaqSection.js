// export default function FaqSection({ faqs }) {
//   // Safe check if faqs data is missing
//   if (!faqs || faqs.length === 0) return null; 

//   // ── NEW EARTHY COLOR PALETTE ────────────────────────────────
//   // Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
//   // Headings/Active: #7A3D2A (Dark Burnt)
//   // Default Text: #a07f61 (Warm Brown)
//   // Accents & Borders: #BE6E5B (Terracotta)
//   // ────────────────────────────────────────────────────────────

//   return (
//     <section
//       className="py-24 md:py-32 relative"
//       // Updated to Light Earthy Background matching the theme
//       style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
//     >
//       {/* Top Decorative Line */}
//       <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />

//       <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
//         {/* Header */}
//         <div className="text-center mb-16 md:mb-20">
//           <p className="font-sans text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
//             Common Questions
//           </p>
//           <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] drop-shadow-sm font-bold">
//             Frequently Asked
//           </h2>
//           <div className="flex items-center justify-center gap-4 mt-6">
//             <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]/60" />
//             <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
//             <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]/60" />
//           </div>
//         </div>

//         {/* FAQ Accordion List */}
//         <div className="space-y-4">
//           {faqs.map((faq, i) => (
//             <details 
//               key={i} 
//               className="group border border-[#BE6E5B]/20 hover:border-[#BE6E5B]/60 transition-colors duration-300 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white overflow-hidden shadow-sm hover:shadow-md"
//             >
//               <summary className="flex justify-between items-center cursor-pointer list-none p-6 md:p-8 gap-4 select-none">
//                 <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
//                   {/* Left Indicator Bar */}
//                   <div className="w-[3px] h-6 bg-[#BE6E5B]/30 group-open:bg-[#BE6E5B] flex-shrink-0 transition-colors duration-500 rounded-full" />
                  
//                   {/* Question Text */}
//                   <span className="font-display text-lg md:text-xl text-[#7A3D2A] group-open:text-[#BE6E5B] transition-colors duration-300 font-bold">
//                     {faq.name}
//                   </span>
//                 </div>
                
//                 {/* Plus/Cross Icon Button */}
//                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 border-2 border-[#BE6E5B]/40 group-open:border-[#BE6E5B] group-open:bg-[#BE6E5B] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
//                   <span className="text-[#7A3D2A] group-open:text-[#FDF7F2] font-sans text-xl leading-none group-open:rotate-45 inline-block transition-transform duration-500">
//                     +
//                   </span>
//                 </div>
//               </summary>
              
//               {/* Answer Content */}
//               <div className="pb-8 px-6 md:px-16">
//                 <p className="font-sans text-sm md:text-base text-[#a07f61] font-medium leading-relaxed border-t border-[#BE6E5B]/20 pt-6">
//                   {faq.acceptedAnswer.text}
//                 </p>
//               </div>
//             </details>
//           ))}
//         </div>
        
//       </div>
//     </section>
//   );
// }


export default function FaqSection({ faqs }) {
  // Safe check if faqs data is missing
  if (!faqs || faqs.length === 0) return null; 

  // ── NEW EARTHY COLOR PALETTE ────────────────────────────────
  // Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
  // Headings/Active: #7A3D2A (Dark Burnt)
  // Default Text: #a07f61 (Warm Brown)
  // Accents & Borders: #BE6E5B (Terracotta)
  // ────────────────────────────────────────────────────────────

  return (
    // ✅ A11Y & SEO: Added aria-labelledby to clearly identify the section's purpose
    <section
      aria-labelledby="faq-heading"
      className="py-24 md:py-32 relative"
      // Updated to Light Earthy Background matching the theme
      style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
    >
      {/* Top Decorative Line */}
      {/* ✅ A11Y: Hidden decorative line from screen readers */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="font-sans text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
            Common Questions
          </p>
          <h2 id="faq-heading" className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] drop-shadow-sm font-bold">
            Frequently Asked
          </h2>
          {/* ✅ A11Y: Hidden purely visual star and separators */}
          <div aria-hidden="true" className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]/60" />
            <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
            <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]/60" />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group border border-[#BE6E5B]/20 hover:border-[#BE6E5B]/60 transition-colors duration-300 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white overflow-hidden shadow-sm hover:shadow-md"
            >
              <summary className="flex justify-between items-center cursor-pointer list-none p-6 md:p-8 gap-4 select-none">
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                  {/* Left Indicator Bar */}
                  {/* ✅ A11Y: Hidden purely visual indicator */}
                  <div aria-hidden="true" className="w-[3px] h-6 bg-[#BE6E5B]/30 group-open:bg-[#BE6E5B] flex-shrink-0 transition-colors duration-500 rounded-full" />
                  
                  {/* Question Text */}
                  <span className="font-display text-lg md:text-xl text-[#7A3D2A] group-open:text-[#BE6E5B] transition-colors duration-300 font-bold">
                    {faq.name}
                  </span>
                </div>
                
                {/* Plus/Cross Icon Button */}
                {/* ✅ A11Y: Hidden the "+" icon so screen readers don't read "Plus" at the end of every question */}
                <div aria-hidden="true" className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 border-2 border-[#BE6E5B]/40 group-open:border-[#BE6E5B] group-open:bg-[#BE6E5B] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                  <span className="text-[#7A3D2A] group-open:text-[#FDF7F2] font-sans text-xl leading-none group-open:rotate-45 inline-block transition-transform duration-500">
                    +
                  </span>
                </div>
              </summary>
              
              {/* Answer Content */}
              <div className="pb-8 px-6 md:px-16">
                <p className="font-sans text-sm md:text-base text-[#a07f61] font-medium leading-relaxed border-t border-[#BE6E5B]/20 pt-6">
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            </details>
          ))}
        </div>
        
      </div>
    </section>
  );
}