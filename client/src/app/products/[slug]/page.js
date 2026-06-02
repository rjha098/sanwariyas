// // PURPOSE: INDIVIDUAL PRODUCT PAGE — /products/royal-saree
// import Image from 'next/image';
// import Link from 'next/link';
// import { notFound } from 'next/navigation';
// import Navbar from '@/components/layout/Navbar';
// import Footer from '@/components/layout/Footer';
// import InquiryForm from '@/components/ui/InquiryForm';
// import { fetchProductBySlug, fetchProducts } from '@/lib/api';

// // Generate SEO metadata SPECIFIC to this product
// // params.slug = "royal-banarasi-silk-saree"
// // Next.js calls this function and puts result into <head>
// export async function generateMetadata({ params }) {
//   try {
//     const { product } = await fetchProductBySlug(params.slug);
//     return {
//       title: product.metaTitle || `${product.name} | SANWARIYAS Ethnic Luxury`,
//       description: product.metaDescription || product.shortDescription || product.description.slice(0, 160),
//       alternates: {
//         canonical: `/products/${product.slug}`,
//       },
//       openGraph: {
//         title: product.name,
//         description: product.shortDescription || product.description.slice(0, 160),
//         images: [{ url: product.image, width: 800, height: 1067, alt: product.name }],
//         type: 'website',
//       },
//     };
//   } catch {
//     return { title: 'Product Not Found | Alankar' }; // Note: You might want to change 'Alankar' to 'SANWARIYAS' here if that was a typo
//   }
// }

// export async function generateStaticParams() {
//   try {
//     const data = await fetchProducts({ limit: 100 });
//     return (data.products || []).map((p) => ({ slug: p.slug }));
//   } catch {
//     return [];
//   }
// }

// export default async function ProductDetailPage({ params }) {
//   let product;
//   try {
//     const data = await fetchProductBySlug(params.slug);
//     product = data.product;
//   } catch {
//     notFound();
//   }

//   const productSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'Product',
//     name: product.name,
//     description: product.description,
//     image: [product.image, ...(product.images || [])],
//     sku: product.slug,
//     category: product.category,
//     offers: {
//       '@type': 'Offer',
//       price: product.price,
//       priceCurrency: 'INR',
//       availability: product.isAvailable
//         ? 'https://schema.org/InStock'
//         : 'https://schema.org/OutOfStock',
//       seller: {
//         '@type': 'Organization',
//         name: 'SANWARIYAS Ethnic Luxury', // Updated from Alankar
//       },
//     },
//   };

//   const discount = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : null;

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
//       />
//       <Navbar />

//       {/* ✅ A11Y & SEO: Breadcrumb navigation wrapped in semantic <nav> and <ol> */}
//       <div className="bg-brand-african/95 pt-24 pb-4">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <nav aria-label="Breadcrumb" className="font-sans text-xs text-brand-cream/40 flex items-center gap-2">
//             <ol className="flex items-center gap-2 list-none p-0 m-0">
//               <li>
//                 <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
//               </li>
//               <li aria-hidden="true">›</li>
//               <li>
//                 <Link href="/products" className="hover:text-brand-gold transition-colors">Collections</Link>
//               </li>
//               <li aria-hidden="true">›</li>
//               {product.category && (
//                 <>
//                   <li>
//                     <Link href={`/products?category=${product.category}`} className="hover:text-brand-gold transition-colors">
//                       {product.category}
//                     </Link>
//                   </li>
//                   <li aria-hidden="true">›</li>
//                 </>
//               )}
//               <li>
//                 <span aria-current="page" className="text-brand-cream/70">{product.name}</span>
//               </li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       {/* ✅ A11Y: Added id="main-content" */}
//       <main id="main-content" className="bg-brand-parchment">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

//             {/* Images */}
//             {/* ✅ A11Y & SEO: Wrapped images in semantic <figure> */}
//             <figure className="space-y-4 m-0">
//               <div className="relative aspect-[3/4] product-img-wrap overflow-hidden bg-white shadow-md">
//                 <Image
//                   src={product.image}
//                   alt={`Front view of ${product.name}`}
//                   fill
//                   sizes="(max-width: 1024px) 100vw, 50vw"
//                   className="object-cover"
//                   priority
//                 />
//                 {product.isFeatured && (
//                   <div className="absolute top-4 left-4 bg-brand-gold text-brand-african text-[10px] tracking-widest uppercase px-3 py-1.5 font-sans font-500">
//                     Featured
//                   </div>
//                 )}
//               </div>
//               {product.images?.length > 0 && (
//                 <div className="grid grid-cols-4 gap-2" role="group" aria-label="Product image gallery">
//                   {[product.image, ...product.images].slice(0, 4).map((img, i) => (
//                     <div key={i} className="relative aspect-square overflow-hidden bg-white cursor-pointer">
//                       <Image 
//                         src={img} 
//                         alt={`Detailed view ${i + 1} of ${product.name}`} 
//                         fill 
//                         className="object-cover hover:scale-110 transition-transform duration-300" 
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </figure>

//             {/* Details */}
//             <div className="lg:sticky lg:top-28 self-start">
//               {product.category && (
//                 <Link href={`/products?category=${product.category}`}>
//                   <span className="font-sans text-[11px] tracking-[0.3em] text-brand-gold uppercase hover:text-brand-coffee transition-colors">
//                     <span className="sr-only">Category: </span>{product.category}
//                   </span>
//                 </Link>
//               )}

//               <h1 className="font-display text-3xl md:text-4xl text-brand-african mt-2 mb-4 leading-snug">
//                 {product.name}
//               </h1>

//               {/* Price */}
//               {/* ✅ A11Y: Added screen-reader only text for price context */}
//               <div className="flex items-baseline gap-4 mb-6">
//                 <span className="font-display text-3xl text-brand-african">
//                   <span className="sr-only">Current Price: </span>₹{product.price.toLocaleString('en-IN')}
//                 </span>
//                 {product.originalPrice && (
//                   <>
//                     <span className="font-sans text-base text-brand-mud/50 line-through">
//                       <span className="sr-only">Original Price: </span>₹{product.originalPrice.toLocaleString('en-IN')}
//                     </span>
//                     <span className="font-sans text-sm text-brand-gold font-500">
//                       <span className="sr-only">Discount: </span>{discount}% OFF
//                     </span>
//                   </>
//                 )}
//               </div>

//               {/* Short desc */}
//               {product.shortDescription && (
//                 <p className="font-serif italic text-brand-mud text-lg leading-relaxed mb-6 border-l-2 border-brand-gold/40 pl-4">
//                   {product.shortDescription}
//                 </p>
//               )}

//               {/* Details */}
//               {(product.fabric || product.occasion) && (
//                 <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 border border-brand-lightgold/30">
//                   {product.fabric && (
//                     <div>
//                       <p className="font-sans text-[10px] tracking-widest uppercase text-brand-gold mb-1">Fabric</p>
//                       <p className="font-sans text-sm text-brand-african">{product.fabric}</p>
//                     </div>
//                   )}
//                   {product.occasion && (
//                     <div>
//                       <p className="font-sans text-[10px] tracking-widest uppercase text-brand-gold mb-1">Occasion</p>
//                       <p className="font-sans text-sm text-brand-african">{product.occasion}</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Tags */}
//               {/* ✅ A11Y & SEO: Converted tags to a semantic list */}
//               {product.tags?.length > 0 && (
//                 <ul aria-label="Product Tags" className="flex flex-wrap gap-2 mb-8 list-none p-0">
//                   {product.tags.map((tag) => (
//                     <li key={tag} className="font-sans text-[10px] tracking-widest uppercase text-brand-mud/60 border border-brand-lightgold/60 px-3 py-1">
//                       {tag}
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               {/* Divider */}
//               {/* ✅ A11Y: Hidden decorative divider */}
//               <div aria-hidden="true" className="flex items-center gap-4 my-8">
//                 <div className="flex-1 h-px bg-brand-lightgold/40" />
//                 <span className="text-brand-gold text-xs">✦</span>
//                 <div className="flex-1 h-px bg-brand-lightgold/40" />
//               </div>

//               {/* Inquiry Form */}
//               <section aria-labelledby="inquiry-heading">
//                 <h2 id="inquiry-heading" className="font-display text-2xl text-brand-african mb-6">Send an Inquiry</h2>
//                 <InquiryForm productId={product._id} productName={product.name} />
//               </section>
//             </div>
//           </div>

//           {/* Description */}
//           <section aria-labelledby="description-heading" className="mt-16 max-w-3xl">
//             <h2 id="description-heading" className="font-display text-2xl text-brand-african mb-6">Product Description</h2>
//             {/* ✅ A11Y: Hidden decorative line */}
//             <div aria-hidden="true" className="h-px bg-brand-lightgold/40 mb-6" />
//             <p className="font-sans text-sm text-brand-mud leading-relaxed">{product.description}</p>
//           </section>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }




// FILE: client/src/app/products/[slug]/page.js
// PURPOSE: INDIVIDUAL PRODUCT PAGE — /products/royal-saree
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InquiryForm from '@/components/ui/InquiryForm';
import { fetchProductBySlug, fetchProducts } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const { product } = await fetchProductBySlug(params.slug);
    return {
      title: product.metaTitle || `${product.name} | SANWARIYAS Wholesale Export`,
      description: product.metaDescription || product.shortDescription || product.description.slice(0, 160),
      alternates: {
        canonical: `/products/${product.slug}`,
      },
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description.slice(0, 160),
        images: [{ url: product.image, width: 800, height: 1067, alt: product.name }],
        type: 'website',
      },
    };
  } catch {
    return { title: 'Product Not Found | SANWARIYAS' };
  }
}

export async function generateStaticParams() {
  try {
    const data = await fetchProducts({ limit: 100 });
    return (data.products || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  let product;
  try {
    const data = await fetchProductBySlug(params.slug);
    product = data.product;
  } catch {
    notFound();
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [product.image, ...(product.images || [])],
    sku: product.slug,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'SANWARIYAS Ethnic Luxury',
      },
    },
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Navbar />

      <div className="bg-[#574325] pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="font-sans text-xs text-[#F5EFE6]/60 flex items-center gap-2">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li>
                <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href="/products" className="hover:text-[#C9A84C] transition-colors">Wholesale Catalog</Link>
              </li>
              <li aria-hidden="true">›</li>
              {product.category && (
                <>
                  <li>
                    <Link href={`/products?category=${product.category}`} className="hover:text-[#C9A84C] transition-colors">
                      {product.category}
                    </Link>
                  </li>
                  <li aria-hidden="true">›</li>
                </>
              )}
              <li>
                <span aria-current="page" className="text-[#F5EFE6]">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main id="main-content" className="bg-[#FAF3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Images */}
            <figure className="space-y-4 m-0">
              <div className="relative aspect-[3/4] product-img-wrap overflow-hidden bg-white shadow-md border border-[#C9A84C]/20">
                <Image
                  src={product.image}
                  alt={`Front view of ${product.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-[#C9A84C] text-[#574325] text-[10px] tracking-widest uppercase px-3 py-1.5 font-sans font-bold shadow-sm">
                    Featured
                  </div>
                )}
              </div>
              {product.images?.length > 0 && (
                <div className="grid grid-cols-4 gap-3" role="group" aria-label="Product image gallery">
                  {[product.image, ...product.images].slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-[3/4] overflow-hidden bg-white cursor-pointer border border-[#C9A84C]/20">
                      <Image 
                        src={img} 
                        alt={`Detailed view ${i + 1} of ${product.name}`} 
                        fill 
                        className="object-cover hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </figure>

            {/* Details */}
            <div className="lg:sticky lg:top-28 self-start">
              {product.category && (
                <Link href={`/products?category=${product.category}`}>
                  <span className="font-sans text-[11px] tracking-[0.3em] text-[#C9A84C] font-bold uppercase hover:text-[#7A3D2A] transition-colors">
                    <span className="sr-only">Category: </span>{product.category}
                  </span>
                </Link>
              )}

              <h1 className="font-display text-3xl md:text-4xl text-[#7A3D2A] mt-2 mb-4 leading-snug font-bold">
                {product.name}
              </h1>

              {/* B2B Price & MOQ Block */}
              <div className="flex flex-col gap-3 mb-6 bg-white/60 p-5 rounded-lg border border-[#BE6E5B]/20 shadow-sm">
                <div className="inline-flex items-center gap-2 bg-[#FDF7F2] border border-[#BE6E5B]/30 px-3 py-1.5 w-fit rounded-sm">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#BE6E5B]">Minimum Order:</span>
                  <span className="font-sans text-xs font-bold text-[#7A3D2A]">50 Pieces</span>
                </div>
                
                <div className="flex items-baseline gap-4 mt-2">
                  <span className="font-sans text-xs uppercase tracking-widest text-[#a07f61] font-bold">Wholesale Price:</span>
                  <span className="font-display text-3xl font-bold text-[#7A3D2A]">
                    <span className="sr-only">Current Price: </span>₹{product.price.toLocaleString('en-IN')}
                    <span className="text-sm font-sans text-[#a07f61] font-medium ml-1">/ piece</span>
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="font-sans text-base text-[#7A3D2A]/40 line-through">
                        <span className="sr-only">Original Price: </span>₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="font-sans text-xs bg-[#C9A84C]/20 text-[#7A3D2A] px-2 py-1 rounded-sm font-bold">
                        <span className="sr-only">Discount: </span>{discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Short desc */}
              {product.shortDescription && (
                <p className="font-serif italic text-[#a07f61] text-lg leading-relaxed mb-6 border-l-2 border-[#BE6E5B]/40 pl-4">
                  {product.shortDescription}
                </p>
              )}

              {/* Details Matrix */}
              {(product.fabric || product.occasion) && (
                <div className="grid grid-cols-2 gap-4 mb-6 bg-white/80 p-5 border border-[#BE6E5B]/20 rounded-md">
                  {product.fabric && (
                    <div>
                      <p className="font-sans text-[9px] font-bold tracking-widest uppercase text-[#BE6E5B] mb-1">Fabric Spec</p>
                      <p className="font-sans text-sm font-semibold text-[#7A3D2A]">{product.fabric}</p>
                    </div>
                  )}
                  {product.occasion && (
                    <div>
                      <p className="font-sans text-[9px] font-bold tracking-widest uppercase text-[#BE6E5B] mb-1">Target Market</p>
                      <p className="font-sans text-sm font-semibold text-[#7A3D2A]">{product.occasion}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <ul aria-label="Product Tags" className="flex flex-wrap gap-2 mb-8 list-none p-0">
                  {product.tags.map((tag) => (
                    <li key={tag} className="font-sans text-[9px] font-bold tracking-widest uppercase text-[#a07f61] border border-[#a07f61]/30 bg-white/50 px-3 py-1.5 rounded-sm">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {/* Divider */}
              <div aria-hidden="true" className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-[#BE6E5B]/30" />
                <span className="text-[#BE6E5B] text-xs">✦</span>
                <div className="flex-1 h-px bg-[#BE6E5B]/30" />
              </div>

              {/* Inquiry Form */}
              <section aria-labelledby="inquiry-heading" className="bg-white/80 p-6 rounded-xl border border-[#C9A84C]/30 shadow-sm">
                <h2 id="inquiry-heading" className="font-display text-2xl font-bold text-[#7A3D2A] mb-2">Request Wholesale Quote</h2>
                <p className="font-sans text-xs text-[#a07f61] mb-6">Submit your bulk requirements below. Our export desk replies within 24 hours.</p>
                <InquiryForm productId={product._id} productName={product.name} />
              </section>
            </div>
          </div>

          {/* Description */}
          <section aria-labelledby="description-heading" className="mt-20 max-w-3xl bg-white/60 p-8 rounded-xl border border-[#BE6E5B]/10">
            <h2 id="description-heading" className="font-display text-2xl font-bold text-[#7A3D2A] mb-4">Manufacturing Details</h2>
            <div aria-hidden="true" className="h-px bg-[#BE6E5B]/20 mb-6" />
            <p className="font-sans text-sm text-[#a07f61] leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}