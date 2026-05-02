// import Link from 'next/link';

// export default function Footer() {
//   const year = new Date().getFullYear();

//   return (
//     // Thoda sa light, warm earthy brown background (#5C3D2E)
//     <footer className="bg-[#5C3D2E] text-[#FDF7F2]/80">
//       {/* Top ornament */}
//       <div className="h-1 bg-gradient-to-r from-transparent via-[#EAC9A8]/50 to-transparent" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

//           {/* Brand */}
//           <div className="md:col-span-2">
//             <h3 className="font-display text-3xl text-[#EAC9A8] tracking-widest mb-2">SANWARIYAS</h3>
//             <p className="font-serif italic text-[#EAC9A8]/70 text-sm tracking-widest mb-4">Ethnic Luxury</p>
//             <p className="font-sans text-sm leading-relaxed text-[#FDF7F2]/60 max-w-xs">
//               Curating the finest Indian ethnic wear — from handwoven Banarasi silks to opulent bridal lehengas. Each piece tells a story of artisanal heritage.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-[#EAC9A8] mb-6">Quick Links</h4>
//             <ul className="space-y-3">
//               {[
//                 { href: '/', label: 'Home' },
//                 { href: '/products', label: 'All Collections' },
//                 { href: '/products?category=Sarees', label: 'Sarees' },
//                 { href: '/products?category=Lehengas', label: 'Lehengas' },
//                 { href: '/products?category=Suits', label: 'Suits & Kurtis' },
//                 { href: '/contact', label: 'Send Inquiry' },
//               ].map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="font-sans text-sm text-[#FDF7F2]/60 hover:text-[#FDF7F2] transition-colors duration-300 flex items-center gap-2"
//                   >
//                     <span className="text-[#EAC9A8]/40">›</span> {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-[#EAC9A8] mb-6">Contact Us</h4>
//             <ul className="space-y-4 text-sm">
//               <li className="flex gap-3">
//                 <span className="text-[#EAC9A8] mt-0.5">✦</span>
//                 <span className="text-[#FDF7F2]/60 leading-relaxed">
//                   Shop no.- 12, 13, 1st floor, Shiv plaza, near HDFC bank, Printers Colony, Dada Gurudev Nagar, Sanganer<br />Jaipur, Rajasthan 302029
//                 </span>
//               </li>
//               <li className="flex gap-3">
//                 <span className="text-[#EAC9A8] mt-0.5">✦</span>
//                 <a href="tel:+919680812813" className="text-[#FDF7F2]/60 hover:text-[#FDF7F2] transition-colors">
//                   +91 9680812813
//                 </a>  
//               </li>
//               <li className="flex gap-3">
//                 <span className="text-[#EAC9A8] mt-0.5">✦</span>
//                 <a href="mailto:hrsanwariyas@gmail.com" className="text-[#FDF7F2]/60 hover:text-[#FDF7F2] transition-colors">
//                  hrsanwariyas@gmail.com
//                 </a>
//               </li>
//               <li className="flex gap-3">
//                 <span className="text-[#EAC9A8] mt-0.5">✦</span>
//                 <span className="text-[#FDF7F2]/60">Mon–Sat: 10am – 7pm</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="mt-12 pt-6 border-t border-[#FDF7F2]/10 flex flex-col md:flex-row justify-between items-center gap-6">
//           <p className="font-sans text-xs text-[#FDF7F2]/40 tracking-widest text-center md:text-left">
//             © {year} SANWARIYAS Ethnic Luxury. All rights reserved.
//           </p>

//           {/* Social Media Logos (Duplicates Removed) */}
//           <div className="flex gap-6 items-center">
//             {/* Facebook (Official Blue) */}
//             <a href="#" aria-label="Facebook" className="text-[#1877F2] hover:opacity-80 transition-opacity duration-300">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
//               </svg>
//             </a>

//             {/* Instagram (Official Pink/Magenta) */}
//             <a href="https://www.instagram.com/sanwariyas_jaipur?igsh=MW1oYmh5ZDQ0NDE3" aria-label="Instagram" className="text-[#E4405F] hover:opacity-80 transition-opacity duration-300">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
//               </svg>
//             </a>

//             {/* LinkedIn (Official Blue) */}
//             <a href="#" aria-label="LinkedIn" className="text-[#0A66C2] hover:opacity-80 transition-opacity duration-300">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
//               </svg>
//             </a>

//             {/* Pinterest (Official Red) */}
//             <a href="#" aria-label="Pinterest" className="text-[#E60023] hover:opacity-80 transition-opacity duration-300">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.433 2.981 7.433 6.962 0 4.156-2.617 7.502-6.257 7.502-1.22 0-2.368-.633-2.76-1.38l-.752 2.868c-.271 1.042-1.002 2.348-1.492 3.143 1.14.35 2.347.538 3.585.538 6.621 0 11.989-5.368 11.989-11.988C24.006 5.367 18.638 0 12.017 0z"/>
//               </svg>
//             </a>
//           </div>

//           <div className="flex gap-6 text-xs text-[#FDF7F2]/40 tracking-widest">
//             <a href="#" className="hover:text-[#FDF7F2]/70 transition-colors">Privacy Policy</a>
//             <a href="#" className="hover:text-[#FDF7F2]/70 transition-colors">Terms of Use</a>
//           </div>
//         </div>

//       </div>
//     </footer>  
//   );
// }




import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    // Thoda sa light, warm earthy brown background (#5C3D2E)
    <footer className="bg-[#5C3D2E] text-[#FDF7F2]/80">
      {/* Top ornament */}
      {/* ✅ A11Y: Hidden decorative top line */}
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-transparent via-[#EAC9A8]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl text-[#EAC9A8] tracking-widest mb-2">SANWARIYAS</h2>
            <p className="font-serif italic text-[#EAC9A8]/70 text-sm tracking-widest mb-4">Ethnic Luxury</p>
            <p className="font-sans text-sm leading-relaxed text-[#FDF7F2]/60 max-w-xs">
              Curating the finest Indian ethnic wear — from handwoven Banarasi silks to opulent bridal lehengas. Each piece tells a story of artisanal heritage.
            </p>
          </div>

          {/* Quick Links */}
          {/* ✅ A11Y & SEO: Wrapped links in semantic <nav> */}
          <nav aria-label="Footer Quick Links">
            <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-[#EAC9A8] mb-6">Quick Links</h2>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Collections' },
                { href: '/products?category=Sarees', label: 'Sarees' },
                { href: '/products?category=Lehengas', label: 'Lehengas' },
                { href: '/products?category=Suits', label: 'Suits & Kurtis' },
                { href: '/contact', label: 'Send Inquiry' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-[#FDF7F2]/60 hover:text-[#FDF7F2] transition-colors duration-300 flex items-center gap-2"
                  >
                    {/* ✅ A11Y: Hidden decorative arrow */}
                    <span aria-hidden="true" className="text-[#EAC9A8]/40">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          {/* ✅ A11Y & SEO: Wrapped contact info in semantic <address> for Local SEO */}
          <address className="not-italic">
            <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-[#EAC9A8] mb-6">Contact Us</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                {/* ✅ A11Y: Hidden decorative star */}
                <span aria-hidden="true" className="text-[#EAC9A8] mt-0.5">✦</span>
                <span className="text-[#FDF7F2]/60 leading-relaxed">
                  Shop no.- 12, 13, 1st floor, Shiv plaza, near HDFC bank, Printers Colony, Dada Gurudev Nagar, Sanganer<br />Jaipur, Rajasthan 302029
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[#EAC9A8] mt-0.5">✦</span>
                <a href="tel:+919680812813" className="text-[#FDF7F2]/60 hover:text-[#FDF7F2] transition-colors">
                  +91 9680812813
                </a>  
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[#EAC9A8] mt-0.5">✦</span>
                <a href="mailto:hrsanwariyas@gmail.com" className="text-[#FDF7F2]/60 hover:text-[#FDF7F2] transition-colors">
                 hrsanwariyas@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="text-[#EAC9A8] mt-0.5">✦</span>
                <span className="text-[#FDF7F2]/60">Mon–Sat: 10am – 7pm</span>
              </li>
            </ul>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#FDF7F2]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-xs text-[#FDF7F2]/40 tracking-widest text-center md:text-left">
            © {year} SANWARIYAS Ethnic Luxury. All rights reserved.
          </p>

          {/* Social Media Logos */}
          {/* ✅ A11Y & SEO: Wrapped in semantic nav element */}
          <nav aria-label="Social Media Links" className="flex gap-6 items-center">
            {/* Facebook (Official Blue) */}
            <a href="#" aria-label="Facebook" className="text-[#1877F2] hover:opacity-80 transition-opacity duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Instagram (Official Pink/Magenta) */}
            <a href="https://www.instagram.com/sanwariyas_jaipur?igsh=MW1oYmh5ZDQ0NDE3" aria-label="Instagram" className="text-[#E4405F] hover:opacity-80 transition-opacity duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>

            {/* LinkedIn (Official Blue) */}
            <a href="#" aria-label="LinkedIn" className="text-[#0A66C2] hover:opacity-80 transition-opacity duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Pinterest (Official Red) */}
            <a href="#" aria-label="Pinterest" className="text-[#E60023] hover:opacity-80 transition-opacity duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.433 2.981 7.433 6.962 0 4.156-2.617 7.502-6.257 7.502-1.22 0-2.368-.633-2.76-1.38l-.752 2.868c-.271 1.042-1.002 2.348-1.492 3.143 1.14.35 2.347.538 3.585.538 6.621 0 11.989-5.368 11.989-11.988C24.006 5.367 18.638 0 12.017 0z"/>
              </svg>
            </a>
          </nav>

          {/* ✅ A11Y & SEO: Wrapped legal links in semantic nav element */}
          <nav aria-label="Legal Policies" className="flex gap-6 text-xs text-[#FDF7F2]/40 tracking-widest">
            <a href="#" className="hover:text-[#FDF7F2]/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FDF7F2]/70 transition-colors">Terms of Use</a>
          </nav>
        </div>

      </div>
    </footer>  
  );
}