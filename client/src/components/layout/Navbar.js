// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";

// const navLinks = [
//   { href: "/", label: "Home", title: "Sanwariyas Home - Premium Ethnic Wear" },
//   { href: "/products", label: "Products", title: "Sanwariyas Products - Bridal & Ethnic Wear" },
//   { href: "/contact", label: "Inquire", title: "Contact Sanwariyas - Send an Inquiry" },
//   { href: "/about", label: "About", title: "About Sanwariyas - Our Story & Heritage" },
//   { href: "/exportdocs", label: "Export", title: "Sanwariyas Export Documentation & Wholesale" },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [hoveredLink, setHoveredLink] = useState(null);
//   const [logoHovered, setLogoHovered] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => { setMenuOpen(false); }, [pathname]);

//   return (
//     <>
//       <style>{`
//         .sw-nav-ul {
//           position: absolute; bottom: -4px; left: 0;
//           height: 2px; width: 0%; border-radius: 99px;
//           background: linear-gradient(90deg, #BE6E5B, #8C4535);
//           transition: width 0.3s ease;
//         }
//         .sw-nav-link:hover .sw-nav-ul,
//         .sw-nav-link.active .sw-nav-ul { width: 100%; }

//         .sw-cta-btn { transition: all 0.3s ease; }
//         .sw-cta-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 25px rgba(190,110,91,0.45) !important;
//         }
//         .sw-cta-btn:active { transform: scale(0.96); }

//         /* Auth Link Style */
//         .sw-auth-link {
//           font-family: sans-serif;
//           font-size: 10px;
//           font-weight: 700;
//           letter-spacing: 0.15em;
//           text-transform: uppercase;
//           color: #a07f61;
//           text-decoration: none;
//           transition: color 0.3s ease;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .sw-auth-link:hover { color: #7A3D2A; }

//         .sw-hbar {
//           display: block; height: 2px;
//           border-radius: 2px;
//           transition: all 0.3s ease;
//         }

//         .sw-mob-link { transition: all 0.2s ease; }
//         .sw-mob-link:hover { color: #BE6E5B !important; padding-left: 8px; }
//       `}</style>

//       <header
//         role="banner"
//         style={{
//           position: "fixed",
//           top: 0, left: 0, right: 0,
//           zIndex: 50,
//           background: "rgba(255, 245, 240, 0.97)",
//           backdropFilter: "blur(16px)",
//           WebkitBackdropFilter: "blur(16px)",
//           borderBottom: "1px solid rgba(190,110,91,0.25)",
//           boxShadow: "0 4px 20px rgba(190,110,91,0.12)",
//         }}
//       >
//         {/* Main Nav Row */}
//         <div
//           style={{
//             maxWidth: "1280px",
//             margin: "0 auto",
//             padding: "16px 24px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           {/* LOGO */}
//           <Link
//             href="/"
//             aria-label="Sanwariyas Homepage"
//             onMouseEnter={() => setLogoHovered(true)}
//             onMouseLeave={() => setLogoHovered(false)}
//             style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
//           >
//             <div
//               style={{
//                 position: "relative",
//                 width: "48px",
//                 height: "48px",
//                 flexShrink: 0,
//               }}
//             >
//               <Image
//                 src="/images/logooo.png"
//                 alt="Sanwariyas Logo"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>

//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <span
//                 style={{
//                   fontFamily: 'Georgia, "Times New Roman", serif',
//                   fontSize: "1.3rem",
//                   letterSpacing: "0.15em",
//                   fontWeight: "700",
//                   lineHeight: "1",
//                   color: logoHovered ? "#BE6E5B" : "#a07f61",
//                   transition: "color 0.3s ease",
//                 }}
//               >
//                 SANWARIYAS
//               </span>
//               <span
//                 style={{
//                   fontFamily: "sans-serif",
//                   fontSize: "8px",
//                   letterSpacing: "0.3em",
//                   textTransform: "uppercase",
//                   marginTop: "4px",
//                   color: logoHovered ? "#BE6E5B" : "#a07f61",
//                   transition: "color 0.3s ease",
//                 }}
//               >
//                 Ethnic Luxury
//               </span>
//             </div>
//           </Link>

//           {/* DESKTOP NAV */}
//           <nav
//             aria-label="Main Navigation"
//             className="hidden lg:flex"
//             style={{ alignItems: "center", gap: "32px" }}
//           >
//             {navLinks.map((link) => {
//               const isActive = pathname === link.href;
//               const isHovered = hoveredLink === link.href;
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   title={link.title}
//                   aria-current={isActive ? "page" : undefined}
//                   className={`sw-nav-link${isActive ? " active" : ""}`}
//                   onMouseEnter={() => setHoveredLink(link.href)}
//                   onMouseLeave={() => setHoveredLink(null)}
//                   style={{
//                     position: "relative",
//                     fontFamily: "sans-serif",
//                     fontSize: "11px",
//                     letterSpacing: "0.2em",
//                     textTransform: "uppercase",
//                     fontWeight: isActive ? "800" : "600",
//                     textDecoration: "none",
//                     paddingBottom: "4px",
//                     color: isActive ? "#7A3D2A" : isHovered ? "#BE6E5B" : "#a07f61",
//                     transition: "color 0.2s ease",
//                   }}
//                 >
//                   {link.label}
//                   <span className="sw-nav-ul" />
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* AUTH, CTA + HAMBURGER */}
//           <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

//             {/* Desktop Auth (Single Login Link with Icon) */}
//             <div className="hidden lg:flex items-center mr-2 border-r border-[#BE6E5B]/20 pr-5">
//               <Link href="/login" className="sw-auth-link">
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                   <circle cx="12" cy="7" r="4"></circle>
//                 </svg>
//                 Log In
//               </Link>
//             </div>

//             {/* CTA Button */}
//             <Link
//               href="/contact"
//               className="sw-cta-btn hidden md:inline-flex"
//               title="Send an Inquiry"
//               style={{
//                 alignItems: "center",
//                 gap: "8px",
//                 padding: "10px 24px",
//                 borderRadius: "4px",
//                 background: "linear-gradient(135deg, #a07f61 0%, #BE6E5B 100%)",
//                 color: "#FFFFFF",
//                 fontSize: "10px",
//                 fontWeight: "800",
//                 letterSpacing: "0.2em",
//                 textTransform: "uppercase",
//                 textDecoration: "none",
//                 border: "1px solid #8C4535",
//                 boxShadow: "0 4px 15px rgba(190,110,91,0.35)",
//               }}
//             >
//               <span style={{ fontSize: "12px" }}>✦</span> Inquire Now
//             </Link>

//             {/* HAMBURGER */}
//             <button
//               className="flex lg:hidden"
//               onClick={() => setMenuOpen((o) => !o)}
//               aria-expanded={menuOpen}
//               aria-label={menuOpen ? "Close menu" : "Open menu"}
//               style={{
//                 flexDirection: "column",
//                 gap: "6px",
//                 padding: "8px",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               <span
//                 className="sw-hbar"
//                 style={{
//                   width: "24px",
//                   transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none",
//                   background: menuOpen ? "#BE6E5B" : "#a07f61",
//                 }}
//               />
//               <span
//                 className="sw-hbar"
//                 style={{
//                   width: menuOpen ? "0" : "24px",
//                   opacity: menuOpen ? 0 : 1,
//                   background: "#a07f61",
//                 }}
//               />
//               <span
//                 className="sw-hbar"
//                 style={{
//                   width: "24px",
//                   transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none",
//                   background: menuOpen ? "#BE6E5B" : "#a07f61",
//                 }}
//               />
//             </button>
//           </div>
//         </div>

//         {/* MOBILE MENU */}
//         <nav
//           id="sw-mobile-menu"
//           aria-label="Mobile Navigation"
//           aria-hidden={!menuOpen}
//           className="lg:hidden"
//           style={{
//             maxHeight: menuOpen ? "100vh" : "0",
//             opacity: menuOpen ? 1 : 0,
//             overflowY: "auto",
//             transition: "all 0.5s ease-in-out",
//             background: "linear-gradient(180deg, #FFF0EB 0%, #FFE8DF 100%)",
//           }}
//         >
//           <div style={{ padding: "24px 32px", paddingBottom: "40px" }}>
//             {navLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   onClick={() => setMenuOpen(false)}
//                   className="sw-mob-link"
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     padding: "16px 0",
//                     borderBottom: "1px solid rgba(190,110,91,0.2)",
//                     color: isActive ? "#7A3D2A" : "#a07f61",
//                     fontSize: "12px",
//                     fontWeight: isActive ? "800" : "600",
//                     letterSpacing: "0.2em",
//                     textTransform: "uppercase",
//                     textDecoration: "none",
//                   }}
//                 >
//                   <span>{link.label}</span>
//                   <span style={{ color: isActive ? "#7A3D2A" : "#BE6E5B", fontSize: "18px" }}>›</span>
//                 </Link>
//               );
//             })}

//             {/* Mobile Auth (Single Login Link) */}
//             <Link
//               href="/login"
//               onClick={() => setMenuOpen(false)}
//               className="sw-mob-link"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "16px 0",
//                 borderBottom: "1px solid rgba(190,110,91,0.2)",
//                 color: "#a07f61",
//                 fontSize: "12px",
//                 fontWeight: "600",
//                 letterSpacing: "0.2em",
//                 textTransform: "uppercase",
//                 textDecoration: "none",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                   <circle cx="12" cy="7" r="4"></circle>
//                 </svg>
//                 <span>Log In / Register</span>
//               </div>
//               <span style={{ color: "#BE6E5B", fontSize: "18px" }}>›</span>
//             </Link>

//             {/* Mobile CTA */}
//             <Link
//               href="/contact"
//               onClick={() => setMenuOpen(false)}
//               style={{
//                 display: "block",
//                 textAlign: "center",
//                 marginTop: "32px",
//                 padding: "14px",
//                 borderRadius: "6px",
//                 background: "linear-gradient(135deg, #a07f61 0%, #BE6E5B 100%)",
//                 color: "#FFFFFF",
//                 fontSize: "11px",
//                 fontWeight: "800",
//                 letterSpacing: "0.2em",
//                 textTransform: "uppercase",
//                 textDecoration: "none",
//                 border: "1px solid #8C4535",
//                 boxShadow: "0 8px 20px rgba(190,110,91,0.3)",
//               }}
//             >
//               ✦ Send Inquiry ✦
//             </Link>
//           </div>
//         </nav>
//       </header>
//     </>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home", title: "Sanwariyas Home - Premium Ethnic Wear" },
  { href: "/products", label: "Products", title: "Sanwariyas Products - Bridal & Ethnic Wear" },
  { href: "/contact", label: "Inquire", title: "Contact Sanwariyas - Send an Inquiry" },
  { href: "/about", label: "About", title: "About Sanwariyas - Our Story & Heritage" },
  { href: "/exportdocs", label: "Export", title: "Sanwariyas Export Documentation & Wholesale" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        .sw-nav-ul {
          position: absolute; bottom: -4px; left: 0;
          height: 2px; width: 0%; border-radius: 99px;
          background: linear-gradient(90deg, #BE6E5B, #8C4535);
          transition: width 0.3s ease;
        }
        .sw-nav-link:hover .sw-nav-ul,
        .sw-nav-link.active .sw-nav-ul { width: 100%; }

        .sw-cta-btn { transition: all 0.3s ease; }
        .sw-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(190,110,91,0.45) !important;
        }
        .sw-cta-btn:active { transform: scale(0.96); }

        /* Auth Link Style */
        .sw-auth-link {
          font-family: sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a07f61;
          text-decoration: none;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sw-auth-link:hover { color: #7A3D2A; }

        .sw-hbar {
          display: block; height: 2px;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .sw-mob-link { transition: all 0.2s ease; }
        .sw-mob-link:hover { color: #BE6E5B !important; padding-left: 8px; }
      `}</style>

      <header
        role="banner"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          background: "rgba(255, 245, 240, 0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(190,110,91,0.25)",
          boxShadow: "0 4px 20px rgba(190,110,91,0.12)",
        }}
      >
        {/* Main Nav Row */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            aria-label="Sanwariyas Homepage"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
          >
            <div
              style={{
                position: "relative",
                width: "48px",
                height: "48px",
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/logooo.png"
                alt="Sanwariyas Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: "1.3rem",
                  letterSpacing: "0.15em",
                  fontWeight: "700",
                  lineHeight: "1",
                  color: logoHovered ? "#BE6E5B" : "#a07f61",
                  transition: "color 0.3s ease",
                }}
              >
                SANWARIYAS
              </span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  marginTop: "4px",
                  color: logoHovered ? "#BE6E5B" : "#a07f61",
                  transition: "color 0.3s ease",
                }}
              >
                Ethnic Luxury
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: "32px" }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.title}
                  aria-current={isActive ? "page" : undefined}
                  className={`sw-nav-link${isActive ? " active" : ""}`}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    position: "relative",
                    fontFamily: "sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: isActive ? "800" : "600",
                    textDecoration: "none",
                    paddingBottom: "4px",
                    color: isActive ? "#7A3D2A" : isHovered ? "#BE6E5B" : "#a07f61",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                  {/* ✅ A11Y: Hidden decorative underline span */}
                  <span aria-hidden="true" className="sw-nav-ul" />
                </Link>
              );
            })}
          </nav>

          {/* AUTH, CTA + HAMBURGER */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

            {/* Desktop Auth (Single Login Link with Icon) */}
            <div className="hidden lg:flex items-center mr-2 border-r border-[#BE6E5B]/20 pr-5">
              <Link href="/login" className="sw-auth-link" aria-label="Log In">
                {/* ✅ A11Y: Hidden decorative SVG icon */}
                <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Log In
              </Link>
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="sw-cta-btn hidden md:inline-flex"
              title="Send an Inquiry"
              aria-label="Inquire Now"
              style={{
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "4px",
                background: "linear-gradient(135deg, #a07f61 0%, #BE6E5B 100%)",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: "800",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid #8C4535",
                boxShadow: "0 4px 15px rgba(190,110,91,0.35)",
              }}
            >
              {/* ✅ A11Y: Hidden decorative star */}
              <span aria-hidden="true" style={{ fontSize: "12px" }}>✦</span> Inquire Now
            </Link>

            {/* HAMBURGER */}
            <button
              className="flex lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                flexDirection: "column",
                gap: "6px",
                padding: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                className="sw-hbar"
                style={{
                  width: "24px",
                  transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none",
                  background: menuOpen ? "#BE6E5B" : "#a07f61",
                }}
              />
              <span
                className="sw-hbar"
                style={{
                  width: menuOpen ? "0" : "24px",
                  opacity: menuOpen ? 0 : 1,
                  background: "#a07f61",
                }}
              />
              <span
                className="sw-hbar"
                style={{
                  width: "24px",
                  transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none",
                  background: menuOpen ? "#BE6E5B" : "#a07f61",
                }}
              />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <nav
          id="sw-mobile-menu"
          aria-label="Mobile Navigation"
          aria-hidden={!menuOpen}
          className="lg:hidden"
          style={{
            maxHeight: menuOpen ? "100vh" : "0",
            opacity: menuOpen ? 1 : 0,
            overflowY: "auto",
            transition: "all 0.5s ease-in-out",
            background: "linear-gradient(180deg, #FFF0EB 0%, #FFE8DF 100%)",
          }}
        >
          <div style={{ padding: "24px 32px", paddingBottom: "40px" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="sw-mob-link"
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(190,110,91,0.2)",
                    color: isActive ? "#7A3D2A" : "#a07f61",
                    fontSize: "12px",
                    fontWeight: isActive ? "800" : "600",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <span>{link.label}</span>
                  {/* ✅ A11Y: Hidden decorative arrow */}
                  <span aria-hidden="true" style={{ color: isActive ? "#7A3D2A" : "#BE6E5B", fontSize: "18px" }}>›</span>
                </Link>
              );
            })}

            {/* Mobile Auth (Single Login Link) */}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="sw-mob-link"
              aria-label="Log In or Register"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: "1px solid rgba(190,110,91,0.2)",
                color: "#a07f61",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* ✅ A11Y: Hidden decorative SVG icon */}
                <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Log In / Register</span>
              </div>
              {/* ✅ A11Y: Hidden decorative arrow */}
              <span aria-hidden="true" style={{ color: "#BE6E5B", fontSize: "18px" }}>›</span>
            </Link>

            {/* Mobile CTA */}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              aria-label="Send Inquiry"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "32px",
                padding: "14px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #a07f61 0%, #BE6E5B 100%)",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid #8C4535",
                boxShadow: "0 8px 20px rgba(190,110,91,0.3)",
              }}
            >
              {/* ✅ A11Y: Cleaned up the reading experience by hiding stars */}
              <span aria-hidden="true">✦ </span>
              Send Inquiry
              <span aria-hidden="true"> ✦</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}