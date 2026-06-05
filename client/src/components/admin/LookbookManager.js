import { useState, useEffect } from 'react';
import { fetchLookbook, createLookbookItem, deleteLookbookItem } from '@/lib/api';

const CATEGORIES = ["Bridal Export", "Festive Collections", "Manufacturing BTS", "Dispatch Diaries"];
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export default function LookbookManager({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState(null);

  const loadLookbook = async () => {
    try {
      const data = await fetchLookbook();
      if (data.success) setItems(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLookbook();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    setUploading(true);
    
    // File bhejne ke liye FormData banana padta hai
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    try {
      await createLookbookItem(token, formData);
      setMessage("Image added successfully!");
      setTitle('');
      setFile(null);
      // Pura data wapas reload karein
      loadLookbook(); 
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteLookbookItem(token, id);
      setMessage("Image deleted!");
      loadLookbook();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <section className="space-y-6">
      {/* UPLOAD FORM */}
      <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
        <h2 className="font-display text-2xl text-brand-african mb-4">Add to Gallery</h2>
        <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
          <input
            type="text"
            placeholder="Image Title (e.g., Red Banarasi Saree)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* 🔴 FILE INPUT FOR IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />

          {message && (
             <p className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3">
               {message}
             </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-brand-coffee text-brand-cream px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      {/* GALLERY TABLE */}
      <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
        <h2 className="font-display text-2xl text-brand-african mb-4">Manage Gallery</h2>
        
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-lightgold/60 text-[10px] uppercase tracking-[0.2em] text-brand-mud/70">
                <th className="py-3">Image</th>
                <th className="py-3">Title</th>
                <th className="py-3">Category</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} className="border-b border-brand-lightgold/20">
                  <td className="py-3">
                    <img src={`${BACKEND_URL}${item.image}`} alt={item.title} className="w-16 h-16 object-cover border" />
                  </td>
                  <td className="py-3 font-sans text-sm">{item.title}</td>
                  <td className="py-3 font-sans text-sm text-brand-mud">{item.category}</td>
                  <td className="py-3">
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-red-200 text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}