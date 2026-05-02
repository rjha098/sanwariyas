// // PURPOSE: The upgraded B2B wholesale inquiry form

// 'use client';
// import { useState } from 'react';
// import { submitInquiry } from '@/lib/api';
// import Toast from '@/components/ui/Toast'; // Ensure this path matches where you saved the Toast file

// export default function InquiryForm({ productId = null, productName = '' }) {
//   const [form, setForm] = useState({
//     name: '',  
//     companyName: '',
//     email: '',
//     whatsapp: '',
//     country: '',
//     productCategory: 'Cotton',
//     quantity: 50,
//     budgetRange: '',  
//     message: productName ? `I am interested in: ${productName}. Please share pricing and availability.` : '',
//   });
  
//   const [status, setStatus] = useState('idle'); // idle | loading | success
  
//   // Custom Toast State
//   const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

//   const showToast = (message, type = 'success') => {
//     setToast({ isVisible: true, message, type });
//   };

//   const closeToast = () => {
//     setToast(prev => ({ ...prev, isVisible: false }));
//   };

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleWhatsAppRedirect = () => {
//     const adminPhone = "919680812813"; 
//     const text = `Hi, I just submitted an inquiry on your website.\n\nCompany: ${form.companyName}\nCategory: ${form.productCategory}\nQuantity: ${form.quantity} pcs\n\nCan we discuss further?`;
//     window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus('loading');

//     // Custom MOQ Validation with Error Toast
//     if (form.quantity < 50) {
//       setStatus('idle');
//       showToast('Minimum Order Quantity (MOQ) is 50 pieces.', 'error');
//       return;
//     }

//     try {
//       await submitInquiry({ ...form, productId, productName });
//       setStatus('success');
//       showToast('Query submitted! Thanks for your valuable time.', 'success');
//     } catch (err) {
//       setStatus('idle');
//       showToast(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
//     }
//   };

//   return (
//     <>
//       {/* Custom Toast Component Rendered Here */}
//       <Toast 
//         isVisible={toast.isVisible} 
//         message={toast.message} 
//         type={toast.type} 
//         onClose={closeToast} 
//       />

//       {status === 'success' ? (
//         <div className="bg-brand-parchment border border-brand-gold/40 p-8 text-center animate-fade-in">
//           <div className="text-4xl mb-4 text-brand-gold">✦</div>
//           <h3 className="font-display text-2xl text-brand-african mb-3">Inquiry Received!</h3>
//           <p className="font-sans text-sm text-brand-mud leading-relaxed mb-6">
//             Our wholesale team will review your requirements and contact you within 2 hours.
//           </p>
          
//           <button
//             onClick={handleWhatsAppRedirect}
//             className="w-full bg-[#25D366] text-white font-sans text-xs tracking-[0.2em] uppercase py-4 hover:bg-[#1DA851] transition-all duration-300 flex items-center justify-center gap-3 mb-4 shadow-lg"
//           >
//             ✦ Connect on WhatsApp Now
//           </button>

//           <button
//             onClick={() => {
//               setStatus('idle');
//               setForm({ name: '', companyName: '', email: '', whatsapp: '', country: '', productCategory: 'Cotton', quantity: 50, budgetRange: '', message: '' });
//             }}
//             className="font-sans text-[10px] tracking-widest uppercase text-brand-coffee border-b border-brand-coffee pb-0.5 hover:text-brand-african transition-colors"
//           >
//             Send Another Inquiry
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {productName && (
//             <div className="bg-brand-lightgold/20 border-l-2 border-brand-gold px-4 py-3">
//               <p className="font-sans text-[10px] tracking-widest uppercase text-brand-gold mb-0.5">Inquiring About</p>
//               <p className="font-display text-brand-african text-lg">{productName}</p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Full Name <span className="text-brand-gold">*</span>
//               </label>
//               <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" />
//             </div>
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Company / Boutique Name <span className="text-brand-gold">*</span>
//               </label>
//               <input type="text" name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Your business name" className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" />
//             </div>
//           </div>
   
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Email Address <span className="text-brand-gold">*</span>
//               </label>
//               <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" />
//             </div>
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 WhatsApp Number <span className="text-brand-gold">*</span>
//               </label>
//               <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Country <span className="text-brand-gold">*</span>
//               </label>
//               <input type="text" name="country" value={form.country} onChange={handleChange} required placeholder="e.g. USA, UK, India" className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" />
//             </div>
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Product Category <span className="text-brand-gold">*</span>
//               </label>
//               <select name="productCategory" value={form.productCategory} onChange={handleChange} className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african focus:outline-none focus:border-brand-coffee transition-colors duration-300 appearance-none">
//                 <option value="Cotton">Cotton Kurtis</option>
//                 <option value="Georgette">Georgette Kurtis</option>
//                 <option value="Silk">Silk Kurtis</option>
//                 <option value="Rayon">Rayon Kurtis</option>
//                 <option value="Mixed">Mixed Blends</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Quantity (MOQ: 50) <span className="text-brand-gold">*</span>
//               </label>
//               <input type="number" name="quantity" min="50" value={form.quantity} onChange={handleChange} required className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" />
//             </div>
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Target Budget (Optional)
//               </label>
//               <input type="text" name="budgetRange" value={form.budgetRange} onChange={handleChange} placeholder="e.g. $10-$15 per piece" className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" />
//             </div>
//           </div>

//           <div>
//             <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//               Message <span className="text-brand-gold">*</span>
//             </label>
//             <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Tell us about your requirements, specific designs, or fabrics..." className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300 resize-none" />
//           </div>

//           <button
//             type="submit"
//             disabled={status === 'loading'}
//             className="w-full bg-brand-coffee text-brand-cream font-sans text-xs tracking-[0.3em] uppercase py-4 hover:bg-brand-african transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
//           >
//             {status === 'loading' ? (
//               <><span className="w-4 h-4 border-2 border-brand-cream/30 border-t-brand-cream rounded-full animate-spin" /> Sending...</>
//             ) : (
//               <>✦ Send Inquiry</>
//             )}
//           </button>

//           <p className="font-sans text-[10px] text-brand-mud/50 text-center uppercase tracking-widest">
//             Strictly Wholesale Only. Minimum Order Quantity is 50 Pieces.
//           </p>
//         </form>
//       )}
//     </>
//   );
// }



// PURPOSE: The upgraded B2B wholesale inquiry form

'use client';
import { useState } from 'react';
import { submitInquiry } from '@/lib/api';
import Toast from '@/components/ui/Toast'; // Ensure this path matches where you saved the Toast file

export default function InquiryForm({ productId = null, productName = '' }) {
  const [form, setForm] = useState({
    name: '',  
    companyName: '',
    email: '',
    whatsapp: '',
    country: '',
    productCategory: 'Cotton',
    quantity: 50,
    budgetRange: '',  
    message: productName ? `I am interested in: ${productName}. Please share pricing and availability.` : '',
  });
  
  const [status, setStatus] = useState('idle'); // idle | loading | success
  
  // Custom Toast State
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWhatsAppRedirect = () => {
    const adminPhone = "919680812813"; 
    const text = `Hi, I just submitted an inquiry on your website.\n\nCompany: ${form.companyName}\nCategory: ${form.productCategory}\nQuantity: ${form.quantity} pcs\n\nCan we discuss further?`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Custom MOQ Validation with Error Toast
    if (form.quantity < 50) {
      setStatus('idle');
      showToast('Minimum Order Quantity (MOQ) is 50 pieces.', 'error');
      return;
    }

    try {
      await submitInquiry({ ...form, productId, productName });
      setStatus('success');
      showToast('Query submitted! Thanks for your valuable time.', 'success');
    } catch (err) {
      setStatus('idle');
      showToast(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <>
      {/* Custom Toast Component Rendered Here */}
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast} 
      />

      {status === 'success' ? (
        // ✅ A11Y: Added role="status" and aria-live so screen readers announce the success state immediately
        <div role="status" aria-live="polite" className="bg-brand-parchment border border-brand-gold/40 p-8 text-center animate-fade-in">
          {/* ✅ A11Y: Hidden decorative star */}
          <div aria-hidden="true" className="text-4xl mb-4 text-brand-gold">✦</div>
          <h3 className="font-display text-2xl text-brand-african mb-3">Inquiry Received!</h3>
          <p className="font-sans text-sm text-brand-mud leading-relaxed mb-6">
            Our wholesale team will review your requirements and contact you within 2 hours.
          </p>
          
          <button
            onClick={handleWhatsAppRedirect}
            aria-label="Connect with us on WhatsApp now"
            className="w-full bg-[#25D366] text-white font-sans text-xs tracking-[0.2em] uppercase py-4 hover:bg-[#1DA851] transition-all duration-300 flex items-center justify-center gap-3 mb-4 shadow-lg"
          >
            <span aria-hidden="true">✦</span> Connect on WhatsApp Now
          </button>

          <button
            onClick={() => {
              setStatus('idle');
              setForm({ name: '', companyName: '', email: '', whatsapp: '', country: '', productCategory: 'Cotton', quantity: 50, budgetRange: '', message: '' });
            }}
            className="font-sans text-[10px] tracking-widest uppercase text-brand-coffee border-b border-brand-coffee pb-0.5 hover:text-brand-african transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        // ✅ A11Y: Added aria-label to identify the form purpose
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Wholesale Inquiry Form">
          {productName && (
            <div className="bg-brand-lightgold/20 border-l-2 border-brand-gold px-4 py-3">
              <p className="font-sans text-[10px] tracking-widest uppercase text-brand-gold mb-0.5">Inquiring About</p>
              <p className="font-display text-brand-african text-lg">{productName}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              {/* ✅ A11Y: Linked label to input via htmlFor and id */}
              <label htmlFor="inquiry-name" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Full Name <span aria-hidden="true" className="text-brand-gold">*</span>
              </label>
              <input 
                id="inquiry-name"
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                aria-required="true"
                autoComplete="name"
                placeholder="Your full name" 
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" 
              />
            </div>
            <div>
              <label htmlFor="inquiry-company" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Company / Boutique Name <span aria-hidden="true" className="text-brand-gold">*</span>
              </label>
              <input 
                id="inquiry-company"
                type="text" 
                name="companyName" 
                value={form.companyName} 
                onChange={handleChange} 
                required 
                aria-required="true"
                autoComplete="organization"
                placeholder="Your business name" 
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" 
              />
            </div>
          </div>
   
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="inquiry-email" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Email Address <span aria-hidden="true" className="text-brand-gold">*</span>
              </label>
              <input 
                id="inquiry-email"
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                aria-required="true"
                autoComplete="email"
                placeholder="your@email.com" 
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" 
              />
            </div>
            <div>
              <label htmlFor="inquiry-whatsapp" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                WhatsApp Number <span aria-hidden="true" className="text-brand-gold">*</span>
              </label>
              <input 
                id="inquiry-whatsapp"
                type="tel" 
                name="whatsapp" 
                value={form.whatsapp} 
                onChange={handleChange} 
                required 
                aria-required="true"
                autoComplete="tel"
                placeholder="+91 XXXXX XXXXX" 
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="inquiry-country" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Country <span aria-hidden="true" className="text-brand-gold">*</span>
              </label>
              <input 
                id="inquiry-country"
                type="text" 
                name="country" 
                value={form.country} 
                onChange={handleChange} 
                required 
                aria-required="true"
                autoComplete="country-name"
                placeholder="e.g. USA, UK, India" 
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" 
              />
            </div>
            <div>
              <label htmlFor="inquiry-category" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Product Category <span aria-hidden="true" className="text-brand-gold">*</span>
              </label>
              <select 
                id="inquiry-category"
                name="productCategory" 
                value={form.productCategory} 
                onChange={handleChange}
                aria-required="true"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african focus:outline-none focus:border-brand-coffee transition-colors duration-300 appearance-none"
              >
                <option value="Cotton">Cotton Kurtis</option>
                <option value="Georgette">Georgette Kurtis</option>
                <option value="Silk">Silk Kurtis</option>
                <option value="Rayon">Rayon Kurtis</option>
                <option value="Mixed">Mixed Blends</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="inquiry-qty" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Quantity (MOQ: 50) <span aria-hidden="true" className="text-brand-gold">*</span>
              </label>
              <input 
                id="inquiry-qty"
                type="number" 
                name="quantity" 
                min="50" 
                value={form.quantity} 
                onChange={handleChange} 
                required 
                aria-required="true"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" 
              />
            </div>
            <div>
              <label htmlFor="inquiry-budget" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Target Budget (Optional)
              </label>
              <input 
                id="inquiry-budget"
                type="text" 
                name="budgetRange" 
                value={form.budgetRange} 
                onChange={handleChange} 
                placeholder="e.g. $10-$15 per piece" 
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="inquiry-message" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
              Message <span aria-hidden="true" className="text-brand-gold">*</span>
            </label>
            <textarea 
              id="inquiry-message"
              name="message" 
              value={form.message} 
              onChange={handleChange} 
              required 
              aria-required="true"
              rows={4} 
              placeholder="Tell us about your requirements, specific designs, or fabrics..." 
              className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300 resize-none" 
            />
          </div>

          {/* ✅ A11Y: Added aria-busy to indicate processing state */}
          <button
            type="submit"
            disabled={status === 'loading'}
            aria-busy={status === 'loading'}
            className="w-full bg-brand-coffee text-brand-cream font-sans text-xs tracking-[0.3em] uppercase py-4 hover:bg-brand-african transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {status === 'loading' ? (
              <><span aria-hidden="true" className="w-4 h-4 border-2 border-brand-cream/30 border-t-brand-cream rounded-full animate-spin" /> Sending...</>
            ) : (
              <><span aria-hidden="true">✦</span> Send Inquiry</>
            )}
          </button>

          <p className="font-sans text-[10px] text-brand-mud/50 text-center uppercase tracking-widest" aria-live="polite">
            Strictly Wholesale Only. Minimum Order Quantity is 50 Pieces.
          </p>
        </form>
      )}
    </>
  );
}