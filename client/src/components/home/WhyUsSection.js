// FILE: client/src/components/home/WhyUsSection.js

const USP_ITEMS = [
  {
    number:"01", title:"MOQ as Low as 50 Pieces",
    desc:"Start small, scale fast. Our flexible minimum order quantity lets boutiques and retailers of every size partner with us without overcommitting inventory.",
    icon:<svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="w-7 h-7" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="12" width="10" height="20" rx="2"/><rect x="15" y="8" width="10" height="24" rx="2"/><rect x="24" y="16" width="10" height="16" rx="2"/></svg>,
  },
  {
    number:"02", title:"Export-Grade Quality Control",
    desc:"Every piece passes a 4-step QC — fabric check, stitching inspection, colour-fastness test, and a final finishing review before dispatch.",
    icon:<svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="w-7 h-7" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="20" r="13"/><path d="M13 20.5 L17.5 25 L27 15"/></svg>,
  },
  {
    number:"03", title:"Direct from Manufacturer",
    desc:"No middlemen. We manufacture in Jaipur and ship directly — factory pricing, faster lead times, and full visibility over every order.",
    icon:<svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="w-7 h-7" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 28 L8 16 L20 8 L32 16 L32 28"/><rect x="15" y="20" width="10" height="8" rx="1"/><path d="M8 28 L32 28"/></svg>,
  },
  {
    number:"04", title:"500+ Fresh Designs Every Season",
    desc:"Our in-house design team launches new prints, silhouettes, and fabric combinations every season — keeping your store ahead of every trend.",
    icon:<svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="w-7 h-7" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="20" r="6"/><path d="M20 6 L20 10 M20 30 L20 34 M6 20 L10 20 M30 20 L34 20"/><path d="M10.1 10.1 L13 13 M27 27 L29.9 29.9 M29.9 10.1 L27 13 M13 27 L10.1 29.9"/></svg>,
  },
  {
    number:"05", title:"Worldwide Export & Fast Dispatch",
    desc:"We ship to 50+ countries with fully insured, trackable consignments. Most orders dispatched within 5–7 business days from confirmation.",
    icon:<svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="w-7 h-7" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="20" r="13"/><path d="M7 20 Q13 14 20 20 Q27 26 33 20"/><path d="M20 7 Q14 13 20 20 Q26 27 20 33"/></svg>,
  },
  {
    number:"06", title:"Custom OEM & Private Label",
    desc:"Your brand tags, packaging, and exclusive designs. Full custom production — perfect for boutique owners building a private label.",
    icon:<svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="w-7 h-7" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 28 L16 16 L28 12 L24 24 Z"/><circle cx="20" cy="20" r="3"/><path d="M8 8 L14 14 M32 8 L26 14 M8 32 L14 26 M32 32 L26 26"/></svg>,
  },
];

export default function WhyUsSection() {
  return (
    <section aria-labelledby="why-us-heading"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background:"linear-gradient(160deg,#FDF7F2 0%,#F2D9C3 60%,#EDD0B5 100%)" }}>

      <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage:"radial-gradient(#7A3D2A 1.5px,transparent 1.5px)",backgroundSize:"30px 30px"}}/>
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"/>
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"/>
      <div aria-hidden="true" className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden lg:block"/>
      <div aria-hidden="true" className="absolute right-6 md:right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden lg:block"/>

      {/* watermark */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display font-bold text-[#7A3D2A]/[0.025] tracking-[-0.04em] leading-none"
          style={{fontSize:"clamp(8rem,18vw,18rem)"}}>WHY US</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 md:mb-20">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
            Why Partner With Us
          </p>
          <h2 id="why-us-heading"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold">
            Built for Wholesale Buyers
          </h2>
          <div aria-hidden="true" className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]"/>
            <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
            <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]"/>
          </div>
          <p className="font-serif italic text-[#a07f61] mt-6 md:mt-8 text-sm md:text-lg max-w-2xl mx-auto font-medium">
            Six reasons global retailers and boutiques trust SANWARIYAS for their ethnic wear sourcing.
          </p>
        </div>

        <ul aria-label="Why choose Sanwariyas"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 list-none p-0 m-0">
          {USP_ITEMS.map((item) => (
            <li key={item.number}>
              <article className="group relative h-full flex flex-col gap-5 p-7 md:p-8 rounded-2xl border border-[#BE6E5B]/20 bg-white/65 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(122,61,42,0.14)] hover:border-[#BE6E5B]/55 hover:bg-white/90 overflow-hidden">

                {/* top accent bar on hover */}
                <div aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#7A3D2A] via-[#BE6E5B] to-[#a07f61] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                {/* watermark number */}
                <span aria-hidden="true"
                  className="absolute top-4 right-5 font-sans text-6xl font-black leading-none text-[#7A3D2A]/[0.05] select-none pointer-events-none group-hover:text-[#BE6E5B]/[0.08] transition-colors duration-500">
                  {item.number}
                </span>

                {/* icon ring */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#BE6E5B]/25 bg-[#BE6E5B]/[0.07] group-hover:bg-[#BE6E5B]/[0.14] group-hover:border-[#BE6E5B]/50 transition-all duration-400 group-hover:scale-110">
                  {item.icon}
                </div>

                {/* accent line — expands on hover */}
                <div aria-hidden="true"
                  className="h-px w-8 bg-gradient-to-r from-[#BE6E5B] to-transparent group-hover:w-16 transition-all duration-500 rounded-full"/>

                <div>
                  <h3 className="font-display text-xl md:text-2xl text-[#7A3D2A] font-bold mb-3 leading-snug group-hover:text-[#BE6E5B] transition-colors duration-400">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm md:text-[14.5px] text-[#a07f61] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}



