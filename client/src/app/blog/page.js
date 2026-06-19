'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '');

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sirf published blogs fetch karega
    api.get('/blogs?status=published')
      .then(res => setBlogs(res.data.data || []))
      .catch(err => console.error("Failed to fetch blogs", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">Loading Stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E8] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-[#574325] mb-4">Our Journal</h1>
          <p className="font-sans text-sm text-[#a07f61] max-w-2xl mx-auto">
            Discover the latest trends, styling tips, and stories behind our collections.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-[#a07f61]">
            <p>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#E8D5A3]/40">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-[#FAF3E8]">
                  {blog.featuredImage ? (
                    <img 
                      src={`${BACKEND_URL}${blog.featuredImage}`} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#E8D5A3]">No Image</div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B]">
                      {blog.category?.name || 'Uncategorized'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#E8D5A3]"></span>
                    <span className="font-sans text-[10px] text-[#a07f61] uppercase tracking-wider">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="font-display text-xl text-[#574325] mb-3 group-hover:text-[#BE6E5B] transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <p className="font-sans text-sm text-[#70543E] line-clamp-3 mb-4 flex-1">
                    {blog.excerpt || 'Click to read the full story...'}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-[#E8D5A3]/30 font-sans text-xs tracking-widest uppercase text-[#574325] group-hover:text-[#BE6E5B] flex items-center gap-2">
                    Read Article &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}