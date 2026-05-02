// // app/login/page.js
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Navbar from '@/components/layout/Navbar';
// import Footer from '@/components/layout/Footer';
// import Toast from '@/components/ui/Toast'; 

// export default function AuthPage() {
//   // State to toggle between Login and Signup
//   const [isLogin, setIsLogin] = useState(true);

//   // Form Field States
//   const [name, setName] = useState('');
//   const [whatsapp, setWhatsapp] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // Toast State
//   const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

//   // Handle Form Submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validation: Check if required fields are empty
//     if (!email || !password || (!isLogin && (!name || !whatsapp))) {
//       setToast({
//         isVisible: true,
//         message: 'All fields are required!',
//         type: 'error',
//       });
//       return;
//     }

//     // Success State (Yahan aap API call laga sakte hain)
//     setToast({
//       isVisible: true,
//       message: isLogin ? 'Login successful!' : 'Account created successfully!',
//       type: 'success',
//     });

//     // Optional: Clear form after success
//     setName('');
//     setWhatsapp('');
//     setEmail('');
//     setPassword('');
//   };

//   const closeToast = () => {
//     setToast((prev) => ({ ...prev, isVisible: false }));
//   };

//   return (
//     <>
//       <Navbar />

//       {/* Toast Component Included Here */}
//       <Toast 
//         isVisible={toast.isVisible} 
//         message={toast.message} 
//         type={toast.type} 
//         onClose={closeToast} 
//       />

//       <main
//         className="min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden"
//         style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
//       >
//         {/* Decorative Background Elements */}
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
//           <span className="font-display text-[25rem] leading-none text-[#7A3D2A]/[0.03] tracking-tighter">S</span>
//         </div>

//         <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#BE6E5B]/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#7A3D2A]/5 rounded-full blur-3xl pointer-events-none" />

//         {/* Auth Card */}
//         <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
//           <div className="bg-white/70 backdrop-blur-md border border-[#BE6E5B]/20 p-8 sm:p-10 rounded-xl shadow-[0_20px_50px_rgba(122,61,42,0.1)] transition-all duration-500">

//             <div className="text-center mb-8">
//               <h1 className="font-display text-3xl text-[#7A3D2A] font-bold mb-2">
//                 {isLogin ? 'Welcome Back' : 'Create an Account'}
//               </h1>
//               <p className="font-sans text-sm text-[#a07f61]">
//                 {isLogin
//                   ? 'Sign in to access your wholesale dashboard'
//                   : 'Join SANWARIYAS for exclusive ethnic luxury'}
//               </p>
//             </div>

//             {/* Form - Added onSubmit handler */}
//             <form className="space-y-5" onSubmit={handleSubmit}>

//               {/* Only show Full Name & WhatsApp if it's Signup */}
//               {!isLogin && (
//                 <>
//                   <div>
//                     <label className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold mb-2">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Enter your name"
//                       className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold mb-2">
//                       WhatsApp Number
//                     </label>
//                     <input
//                       type="tel"
//                       value={whatsapp}
//                       onChange={(e) => setWhatsapp(e.target.value)}
//                       placeholder="+91"
//                       className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
//                     />
//                   </div>
//                 </>
//               )}

//               {/* Email (Always shown) */}
//               <div>
//                 <label className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@company.com"
//                   className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
//                 />
//               </div>

//               {/* Password (Always shown) */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold">
//                     Password
//                   </label>
//                   {isLogin && (
//                     <a href="#" className="font-sans text-[10px] text-[#a07f61] hover:text-[#7A3D2A] transition-colors">
//                       Forgot Password?
//                     </a>
//                   )}
//                 </div>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full mt-6 py-3.5 rounded-md font-sans text-xs tracking-[0.2em] uppercase font-bold text-[#FDF7F2] hover:shadow-[0_10px_20px_rgba(190,110,91,0.3)] hover:-translate-y-0.5 transition-all duration-300"
//                 style={{ background: 'linear-gradient(135deg, #BE6E5B 0%, #a07f61 100%)' }}
//               >
//                 {isLogin ? 'Sign In' : 'Create Account'}
//               </button>
//             </form>

//             {/* Toggle Login/Signup */}
//             <div className="mt-8 text-center border-t border-[#BE6E5B]/15 pt-6">
//               <p className="font-sans text-sm text-[#a07f61]">
//                 {isLogin ? "Don't have an account? " : "Already have an account? "}
//                 <button
//                   onClick={() => {
//                     setIsLogin(!isLogin);
//                     // Clear inputs and toast when toggling
//                     setName('');
//                     setWhatsapp('');
//                     setEmail('');
//                     setPassword('');
//                     closeToast();
//                   }}
//                   className="text-[#7A3D2A] font-bold hover:text-[#BE6E5B] transition-colors underline underline-offset-4 decoration-[#BE6E5B]/30 hover:decoration-[#BE6E5B]"
//                 >
//                   {isLogin ? 'Sign Up' : 'Log In'}
//                 </button>
//               </p>
//             </div>

//           </div>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }




// app/login/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast'; 

export default function AuthPage() {
  // State to toggle between Login and Signup
  const [isLogin, setIsLogin] = useState(true);

  // Form Field States
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Toast State
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Check if required fields are empty
    if (!email || !password || (!isLogin && (!name || !whatsapp))) {
      setToast({
        isVisible: true,
        message: 'All fields are required!',
        type: 'error',
      });
      return;
    }

    // Success State (Yahan aap API call laga sakte hain)
    setToast({
      isVisible: true,
      message: isLogin ? 'Login successful!' : 'Account created successfully!',
      type: 'success',
    });

    // Optional: Clear form after success
    setName('');
    setWhatsapp('');
    setEmail('');
    setPassword('');
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <Navbar />

      {/* Toast Component Included Here */}
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast} 
      />

      {/* ✅ A11Y: Added id="main-content" for landmark navigation */}
      <main
        id="main-content"
        className="min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
      >
        {/* Decorative Background Elements */}
        {/* ✅ A11Y: Hidden purely visual elements from screen readers */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <span className="font-display text-[25rem] leading-none text-[#7A3D2A]/[0.03] tracking-tighter">S</span>
        </div>

        <div aria-hidden="true" className="absolute top-1/4 left-10 w-72 h-72 bg-[#BE6E5B]/10 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#7A3D2A]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
          <div className="bg-white/70 backdrop-blur-md border border-[#BE6E5B]/20 p-8 sm:p-10 rounded-xl shadow-[0_20px_50px_rgba(122,61,42,0.1)] transition-all duration-500">

            <div className="text-center mb-8">
              <h1 className="font-display text-3xl text-[#7A3D2A] font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p className="font-sans text-sm text-[#a07f61]">
                {isLogin
                  ? 'Sign in to access your wholesale dashboard'
                  : 'Join SANWARIYAS for exclusive ethnic luxury'}
              </p>
            </div>

            {/* Form - Added onSubmit handler */}
            {/* ✅ A11Y: Added aria-label and noValidate for custom error handling */}
            <form 
              className="space-y-5" 
              onSubmit={handleSubmit}
              noValidate
              aria-label={isLogin ? "Login Form" : "Sign Up Form"}
            >

              {/* Only show Full Name & WhatsApp if it's Signup */}
              {!isLogin && (
                <>
                  <div>
                    {/* ✅ A11Y: Linked label to input using htmlFor & id */}
                    <label htmlFor="fullName" className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                      aria-required="true"
                      className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91"
                      autoComplete="tel"
                      aria-required="true"
                      className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Email (Always shown) */}
              <div>
                <label htmlFor="emailAddress" className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-required="true"
                  className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
                />
              </div>

              {/* Password (Always shown) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="userPassword" className="block font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] font-bold">
                    Password
                  </label>
                  {isLogin && (
                    <a 
                      href="#" 
                      aria-label="Forgot your password?"
                      className="font-sans text-[10px] text-[#a07f61] hover:text-[#7A3D2A] transition-colors"
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <input
                  id="userPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  aria-required="true"
                  className="w-full px-4 py-3 rounded-md border border-[#BE6E5B]/30 bg-white/50 focus:outline-none focus:border-[#BE6E5B] focus:ring-1 focus:ring-[#BE6E5B] text-[#7A3D2A] placeholder-[#a07f61]/50 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 py-3.5 rounded-md font-sans text-xs tracking-[0.2em] uppercase font-bold text-[#FDF7F2] hover:shadow-[0_10px_20px_rgba(190,110,91,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #BE6E5B 0%, #a07f61 100%)' }}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-8 text-center border-t border-[#BE6E5B]/15 pt-6">
              <p className="font-sans text-sm text-[#a07f61]">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                {/* ✅ A11Y: Explicit type="button" to prevent accidental form submission if placed inside form in future */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    // Clear inputs and toast when toggling
                    setName('');
                    setWhatsapp('');
                    setEmail('');
                    setPassword('');
                    closeToast();
                  }}
                  className="text-[#7A3D2A] font-bold hover:text-[#BE6E5B] transition-colors underline underline-offset-4 decoration-[#BE6E5B]/30 hover:decoration-[#BE6E5B]"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}