// 'use client';
// import { useEffect } from 'react';

// export default function Toast({ message, type = 'success', isVisible, onClose }) {
//   // Automatically hide the toast after 4 seconds
//   useEffect(() => {
//     if (isVisible) {
//       const timer = setTimeout(() => {
//         onClose();
//       }, 6000);
//       return () => clearTimeout(timer);
//     }
//   }, [isVisible, onClose]);

//   return (
//     <div 
//       className={`fixed bottom-8 right-8 z-[9999] flex items-center gap-4 px-6 py-4 min-w-[320px] shadow-2xl border transition-all duration-500 ease-in-out transform ${
//         isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'
//       } ${
//         type === 'success' 
//           ? 'bg-brand-parchment border-brand-gold text-brand-african' 
//           : 'bg-red-50 border-red-400 text-red-900'
//       }`}
//     >
//       <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${
//         type === 'success' ? 'border-brand-gold text-brand-gold' : 'border-red-500 text-red-500'
//       }`}>
//         <span className="text-lg font-bold">{type === 'success' ? '✓' : '!'}</span>
//       </div>
      
//       <p className="font-sans text-sm font-semibold tracking-wide flex-1">
//         {message}
//       </p>
      
//       <button 
//         onClick={onClose}
//         className="text-gray-400 hover:text-gray-800 transition-colors text-lg"
//       >
//         ✕
//       </button>
//     </div>
//   );
// }



'use client';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  // Automatically hide the toast after 6 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div 
      // ✅ A11Y: Added dynamic roles and live regions. 
      // Errors are "alert" (assertive), success is "status" (polite).
      role={type === 'success' ? 'status' : 'alert'}
      aria-live={type === 'success' ? 'polite' : 'assertive'}
      aria-atomic="true"
      className={`fixed bottom-8 right-8 z-[9999] flex items-center gap-4 px-6 py-4 min-w-[320px] shadow-2xl border transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'
      } ${
        type === 'success' 
          ? 'bg-brand-parchment border-brand-gold text-brand-african' 
          : 'bg-red-50 border-red-400 text-red-900'
      }`}
    >
      <div 
        aria-hidden="true" // ✅ A11Y: Hide purely visual icons from screen readers
        className={`flex items-center justify-center w-8 h-8 rounded-full border ${
        type === 'success' ? 'border-brand-gold text-brand-gold' : 'border-red-500 text-red-500'
      }`}>
        <span className="text-lg font-bold">{type === 'success' ? '✓' : '!'}</span>
      </div>
      
      <p className="font-sans text-sm font-semibold tracking-wide flex-1">
        {message}
      </p>
      
      <button 
        onClick={onClose}
        aria-label="Close notification" // ✅ A11Y: Give screen reader users context for the "X"
        className="text-gray-400 hover:text-gray-800 transition-colors text-lg"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}