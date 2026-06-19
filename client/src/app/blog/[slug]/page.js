'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '');

export default function SingleBlogPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    
    api.get(`/blogs/${slug}`)
      .then(res => setBlog(res.data.data))
      .catch(err => setError('Story not found or has been removed.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">Loading Story...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-3xl text-[#574325] mb-4">Story Not Found</h1>
        <p className="font-sans text-[#a07f61] mb-8">{error}</p>
        <Link href="/blog" className="px-6 py-2 border border-[#BE6E5B] text-[#BE6E5B] rounded hover:bg-[#BE6E5B] hover:text-white transition-colors">
          &larr; Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#FAF3E8] pb-20">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Link href="/blog" className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#a07f61] hover:text-[#BE6E5B]">
            Journal
          </Link>
          <span className="w-1 h-1 rounded-full bg-[#E8D5A3]"></span>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B]">
            {blog.category?.name || 'Uncategorized'}
          </span>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#574325] leading-tight mb-6">
          {blog.title}
        </h1>
        
        <p className="font-sans text-sm text-[#a07f61] uppercase tracking-widest">
          Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <img 
            src={`${BACKEND_URL}${blog.featuredImage}`} 
            alt={blog.title} 
            className="w-full h-auto max-h-[60vh] object-cover rounded-2xl shadow-sm"
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Ye classNames prose wagera ensure karenge ki admin ka HTML theek dikhe */}
        <div 
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#574325] prose-p:font-sans prose-p:text-[#70543E] prose-p:leading-relaxed prose-a:text-[#BE6E5B] prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
        />

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#E8D5A3]/40">
            <div className="flex flex-wrap gap-2">
              <span className="font-sans text-xs text-[#a07f61] mr-2 flex items-center">Tags:</span>
              {blog.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white border border-[#E8D5A3] rounded-full font-sans text-xs text-[#70543E]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}