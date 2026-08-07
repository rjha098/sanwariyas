// FILE: client/src/components/layout/Navbar.js
"use client";
import NotificationBell from "@/components/ui/NotificationBell";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

const navLinks = [
  {
    href: "/",
    label: "Home",
    title: "SANWARIYAS Wholesale Ethnic Wear Manufacturer",
  },

  // {
  //   href: "/products",
  //   label: "Products",
  //   title: "SANWARIYAS Wholesale Products - Ethnic Wear Manufacturer",
  // },


  {
    href: "/contact",
    label: "Inquire",
    title: "Contact Sanwariyas - Send an Inquiry",
  },
  {
    href: "/about",
    label: "About",
    title: "About SANWARIYAS Manufacturer",
  },
    {
    href: "/exportdocs",
    label: "Export",
  },
  {
    id: "discover",
    type: "megamenu",
    label: "Discover ▾",
    title: "Discover More",
    columns: [
      {
        title: "Collections & Media",
        links: [
          { href: "/lookbook", label: "Our Lookbook" },
          { href: "/blog", label: "Journal & Blog" },
        ],
      },
      {
        title: "Support",
        links: [
          { href: "/contact", label: "Contact Us" },
          { href: "/faq", label: "FAQs" },
          { href: "/terms", label: "Terms & Conditions" },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobMegaOpen, setMobMegaOpen] = useState(false); // Mobile dropdown toggle ke liye
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoHovered, setLogoHovered] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Auth context and state
  const { isAuthenticated, isCustomer, user, logout } = useAuth();

  const { itemCount: cartItemCount } = useCart();

  useEffect(() => {
    setMenuOpen(false);
    setMobMegaOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/login");
  };

  const getDashboardLink = () => {
    if (user?.role === "admin" || user?.role === "staff")
      return "/operations-center";
    return "/dashboard";
  };

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
          background: transparent;
          border: none;
          cursor: pointer;
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
          top: 0,
          left: 0,
          right: 0,
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
            padding: "6px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            aria-label="SANWARIYAS Wholesale Homepage"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "70px",
                height: "70px",
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/logooo.png"
                alt="SANWARIYAS Ethnic Wear Manufacturer Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span
                className="font-display text-2xl tracking-widest"
                style={{
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
                A True Story Of Elegance
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: "24px", height: "100%" }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === (link.href || link.id);

              // ✅ MEGA MENU RENDERING (Desktop)
              if (link.type === "megamenu") {
                return (
                  <div
                    key={link.id}
                    className="group relative flex items-center"
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{ height: "40px" }}
                  >
                    <button
                      className={`sw-nav-link ${isHovered ? "active" : ""}`}
                      style={{
                        position: "relative",
                        fontFamily: "sans-serif",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontWeight: "600",
                        textDecoration: "none",
                        padding: "0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: isHovered ? "#BE6E5B" : "#a07f61",
                        transition: "color 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {link.label}
                      <span aria-hidden="true" className="sw-nav-ul" />
                    </button>

                    {/* Dropdown Container */}
                    <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-max bg-[#FAF3E8] border border-[#E8D5A3] shadow-[0_10px_40px_rgba(87,67,37,0.15)] rounded-xl p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-[100] flex gap-12">
                      {link.columns.map((col, idx) => (
                        <div key={idx} className="flex flex-col min-w-[160px]">
                          <h3 className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#7A3D2A] mb-4 pb-2 border-b border-[#E8D5A3]/50">
                            {col.title}
                          </h3>
                          <ul className="flex flex-col gap-3">
                            {col.links.map((sublink) => (
                              <li key={sublink.href}>
                                <Link
                                  href={sublink.href}
                                  title={sublink.label}
                                  className="font-sans text-[11px] tracking-[0.1em] text-[#a07f61] hover:text-[#BE6E5B] transition-colors flex items-center gap-2"
                                >
                                  <span className="w-1 h-1 rounded-full bg-[#E8D5A3] block"></span>
                                  {sublink.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Normal Links
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
                    padding: "0",
                    color: isActive
                      ? "#7A3D2A"
                      : isHovered
                        ? "#BE6E5B"
                        : "#a07f61",
                    transition: "color 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {link.label}
                  <span aria-hidden="true" className="sw-nav-ul" />
                </Link>
              );
            })}
          </nav>

          {/* AUTH, CTA + HAMBURGER */}
          {/* AUTH, CTA + HAMBURGER */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {isCustomer && (
              <Link
                href="/cart"
                aria-label="View Cart"
                title="View Cart"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  color: "#7A3D2A",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartItemCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "#7A3D2A",
                      color: "#fff",
                      fontSize: "9px",
                      fontWeight: "bold",
                      borderRadius: "9999px",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-5 mr-2 border-r border-[#BE6E5B]/20 pr-5">
              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="sw-auth-link"
                    aria-label="Dashboard"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="sw-auth-link"
                    aria-label="Log Out"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="sw-auth-link"
                  aria-label="Log In"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Log In
                </Link>
              )}
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
              <span aria-hidden="true" style={{ fontSize: "12px" }}>
                ✦
              </span>{" "}
              Inquire Now
            </Link>

            {isAuthenticated && (
              <div className="hidden lg:block">
                <NotificationBell />
              </div>
            )}

            {/* HAMBURGER */}
            <button
              className="flex lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="sw-mobile-menu"
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
                  transform: menuOpen
                    ? "rotate(45deg) translateY(8px)"
                    : "none",
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
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-8px)"
                    : "none",
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
            visibility: menuOpen ? "visible" : "hidden",
            overflowY: "auto",
            transition: "all 0.5s ease-in-out",
            background: "linear-gradient(180deg, #FFF0EB 0%, #FFE8DF 100%)",
          }}
        >
          <div style={{ padding: "24px 32px", paddingBottom: "40px" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              // ✅ MEGA MENU RENDERING (Mobile Accordion)
              if (link.type === "megamenu") {
                return (
                  <div
                    key={link.id}
                    className="flex flex-col"
                    style={{ borderBottom: "1px solid rgba(190,110,91,0.2)" }}
                  >
                    <button
                      onClick={() => setMobMegaOpen(!mobMegaOpen)}
                      className="sw-mob-link"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 0",
                        color: mobMegaOpen ? "#7A3D2A" : "#a07f61",
                        fontSize: "12px",
                        fontWeight: mobMegaOpen ? "800" : "600",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background: "none",
                        border: "none",
                      }}
                    >
                      <span>{link.label.replace(" ▾", "")}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          color: mobMegaOpen ? "#7A3D2A" : "#BE6E5B",
                          fontSize: "18px",
                          transform: mobMegaOpen ? "rotate(90deg)" : "none",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        ›
                      </span>
                    </button>
                    {/* Mobile Nested Links */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${mobMegaOpen ? "max-h-[800px] pb-4" : "max-h-0"}`}
                    >
                      {link.columns.map((col, idx) => (
                        <div
                          key={idx}
                          className="mb-4 pl-4 border-l border-[#BE6E5B]/20"
                        >
                          <h4 className="text-[#7A3D2A] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                            {col.title}
                          </h4>
                          <div className="flex flex-col gap-3 pl-2">
                            {col.links.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                title={sub.label}
                                onClick={() => setMenuOpen(false)}
                                className="text-[#a07f61] text-[10px] uppercase tracking-wider hover:text-[#BE6E5B] transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.title}
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
                  <span
                    aria-hidden="true"
                    style={{
                      color: isActive ? "#7A3D2A" : "#BE6E5B",
                      fontSize: "18px",
                    }}
                  >
                    ›
                  </span>
                </Link>
              );
            })}

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="sw-mob-link"
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
                  <span>Dashboard</span>
                  <span
                    aria-hidden="true"
                    style={{ color: "#BE6E5B", fontSize: "18px" }}
                  >
                    ›
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="sw-mob-link"
                  style={{
                    width: "100%",
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
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span>Log Out</span>
                  <span
                    aria-hidden="true"
                    style={{ color: "#BE6E5B", fontSize: "18px" }}
                  >
                    ›
                  </span>
                </button>
              </>
            ) : (
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Log In / Register</span>
                </div>
                <span
                  aria-hidden="true"
                  style={{ color: "#BE6E5B", fontSize: "18px" }}
                >
                  ›
                </span>
              </Link>
            )}

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
