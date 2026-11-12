// FILE: client/src/components/home/ProductShowcase.js
import ArchMarquee from "./ArchMarquee";

// Existing catalogue photos — two looks for each of the six signature silhouettes.
// Ordered so neighbouring cards always show different categories.
const PIECES = [
  {
    id: "straight-1",
    name: "Straight 3-Piece",
    note: "Kurta · Pant · Dupatta",
    src: "/images/suits/Straight3piece/3-piece-suit1.png",
  },
  {
    id: "aline-1",
    name: "A-Line Suits",
    note: "Festive · Party · Everyday",
    src: "/images/suits/A-Line/a-line1.png",
  },
  {
    id: "anarkali-1",
    name: "Anarkali",
    note: "Flared · Designer · Timeless",
    src: "/images/suits/Anarkali/anarkali2.png",
  },
  {
    id: "cordset-1",
    name: "Co-ord Sets",
    note: "Matching · Modern · Easy",
    src: "/images/suits/cordset/co-ordsets1.png",
  },
  {
    id: "short-1",
    name: "Short Kurtis",
    note: "Printed · Casual · Daily wear",
    src: "/images/suits/short-Kurtis/short-kurtis1.png",
  },
  {
    id: "long-1",
    name: "Long Kurtis",
    note: "Straight · Ethnic · Elegant",
    src: "/images/suits/LongKurtis/long-kurtis1.png",
  },
  {
    id: "straight-2",
    name: "Straight 3-Piece",
    note: "Kurta · Pant · Dupatta",
    src: "/images/suits/Straight3piece/khbsd.png",
  },
  {
    id: "aline-2",
    name: "A-Line Suits",
    note: "Festive · Party · Everyday",
    src: "/images/suits/A-Line/jsdhj.png",
  },
  {
    id: "anarkali-2",
    name: "Anarkali",
    note: "Flared · Designer · Timeless",
    src: "/images/suits/Anarkali/hjbsc.png",
  },
  {
    id: "cordset-2",
    name: "Co-ord Sets",
    note: "Matching · Modern · Easy",
    src: "/images/suits/cordset/nd.png",
  },
  {
    id: "short-2",
    name: "Short Kurtis",
    note: "Printed · Casual · Daily wear",
    src: "/images/suits/short-Kurtis/hbsdh.png",
  },
  {
    id: "long-2",
    name: "Long Kurtis",
    note: "Straight · Ethnic · Elegant",
    src: "/images/suits/LongKurtis/bs%20xb.png",
  },
];

const ITEMS = PIECES.map((p) => ({
  ...p,
  href: "/lookbook",
  alt: `${p.name} wholesale ethnic wear by SANWARIYAS`,
}));

export default function ProductShowcase() {
  return (
    <section
      aria-labelledby="signature-edit-heading"
      className="font-sans"
      style={{
        background:
          "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(201,168,76,0.10), transparent 70%), linear-gradient(180deg, #FAF3E8 0%, #F6E8D6 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 text-center md:text-left">
        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#BE6E5B] mb-3">
          The Signature Edit
        </p>
        <h2
          id="signature-edit-heading"
          className="font-display text-3xl md:text-4xl lg:text-[2.75rem] leading-tight text-[#7A3D2A] font-normal"
        >
          Six Silhouettes, <span className="italic">Crafted in Jaipur</span>
        </h2>
        <p className="font-serif italic text-[#7A3D2A]/80 text-base md:text-lg mt-3 max-w-xl mx-auto md:mx-0">
          Hover over any piece to zoom in and explore the collection.
        </p>
      </div>

      <ArchMarquee
        items={ITEMS}
        label="SANWARIYAS signature ethnic wear styles"
        ctaLabel="View Lookbook"
      />
    </section>
  );
}
