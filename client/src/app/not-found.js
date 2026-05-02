// import Link from 'next/link';
// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';

// export default function NotFound() {
//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-brand-parchment flex items-center justify-center px-4">
//         <div className="text-center max-w-lg">
//           <p className="font-display text-9xl text-brand-lightgold/50 leading-none mb-6">404</p>
//           <h1 className="font-display text-3xl text-brand-african mb-4">Page Not Found</h1>
//           <p className="font-sans text-sm text-brand-mud/70 mb-10 leading-relaxed">
//             The page you're looking for doesn't exist or has been moved. Let us help you find what you're looking for.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link href="/" className="btn-primary inline-block">Go Home</Link>
//             <Link href="/products" className="btn-outline inline-block">View Collections</Link>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }



import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// ✅ SEO: Added explicit metadata for the 404 page
export const metadata = {
  title: 'Page Not Found | SANWARIYAS Ethnic Luxury',
  description: 'The page you are looking for does not exist. Explore our premium ethnic wear collections instead.',
  robots: {
    index: false, // Explicitly tell search engines not to index this error page
    follow: true, // But allow them to follow the links (Go Home, View Collections) back to the site
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      
      {/* ✅ A11Y: Added id="main-content" for "skip to content" functionality */}
      <main id="main-content" className="min-h-screen bg-brand-parchment flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          
          {/* ✅ A11Y: Hidden the giant "404" text from screen readers so it doesn't sound confusing. 
              They will jump straight to the clear "Page Not Found" h1 heading. */}
          <p aria-hidden="true" className="font-display text-9xl text-brand-lightgold/50 leading-none mb-6">
            404
          </p>
          
          <h1 className="font-display text-3xl text-brand-african mb-4">Page Not Found</h1>
          
          <p className="font-sans text-sm text-brand-mud/70 mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let us help you find what you're looking for.
          </p>
          
          <nav aria-label="Error page navigation" className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="btn-primary inline-block"
              aria-label="Return to the homepage"
            >
              Go Home
            </Link>
            <Link 
              href="/products" 
              className="btn-outline inline-block"
              aria-label="View all product collections"
            >
              View Collections
            </Link>
          </nav>
          
        </div>
      </main>
      
      <Footer />
    </>
  );
}