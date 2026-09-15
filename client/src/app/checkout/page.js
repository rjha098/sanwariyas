// // FILE: client/src/app/checkout/page.js
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { useCart } from "@/hooks/useCart";
// import { placeOrder } from "@/lib/api";
// import Toast from "@/components/ui/Toast";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { token, user, isAuthenticated, authChecking } = useAuth();
//   const { items, totalPieces, totalAmount, allMoqMet, clearCart, hydrated } =
//     useCart();

//   const [placing, setPlacing] = useState(false);
//   const [toast, setToast] = useState({
//     isVisible: false,
//     message: "",
//     type: "success",
//   });
//   const showToast = (message, type = "success") =>
//     setToast({ isVisible: true, message, type });
//   const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

//   useEffect(() => {
//     if (!authChecking && !isAuthenticated) {
//       router.replace("/login?mode=signin&redirect=/checkout");
//     }
//   }, [authChecking, isAuthenticated, router]);

//   useEffect(() => {
//     if (hydrated && items.length === 0) {
//       router.replace("/cart");
//     }
//   }, [hydrated, items.length, router]);

//   const handlePlaceOrder = async () => {
//     if (!allMoqMet) {
//       showToast("Some items do not meet the minimum order quantity.", "error");
//       return;
//     }
//     setPlacing(true);
//     try {
//       const payload = {
//         buyerName: user?.name,
//         buyerEmail: user?.email,
//         buyerCompany: user?.company || "",
//         items: items.map((i) => ({
//           productId: i.productId,
//           name: i.name,
//           pieces: i.pieces,
//         })),
//       };
//       const res = await placeOrder(token, payload);
//       clearCart();
//       showToast("Order placed successfully!", "success");
//       setTimeout(() => {
//         router.push(`/my-orders/${res.order._id}`);
//       }, 1200);
//     } catch (err) {
//       showToast(
//         err.response?.data?.message || "Failed to place order.",
//         "error",
//       );
//     } finally {
//       setPlacing(false);
//     }
//   };

//   if (authChecking || !hydrated) {
//     return (
//       <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
//         <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">
//           Loading...
//         </p>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-[#f5efe4] px-4 sm:px-6 lg:px-8 py-12">
//       <Toast
//         isVisible={toast.isVisible}
//         message={toast.message}
//         type={toast.type}
//         onClose={hideToast}
//       />
//       <div className="max-w-3xl mx-auto">
//         <h1 className="font-display text-3xl text-[#7A3D2A] mb-8">
//           Review &amp; Place Order
//         </h1>

//         <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 mb-6">
//           <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-3">
//             Buyer Details
//           </h2>
//           <p className="font-sans text-sm text-[#7A3D2A]">{user?.name}</p>
//           <p className="font-sans text-sm text-[#a07f61]">{user?.email}</p>
//           {user?.company && (
//             <p className="font-sans text-sm text-[#a07f61]">{user.company}</p>
//           )}
//         </div>

//         <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 mb-6">
//           <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-4">
//             Order Items
//           </h2>
//           <div className="divide-y divide-[#BE6E5B]/10">
//             {items.map((item) => (
//               <div
//                 key={item.productId}
//                 className="py-3 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-sans text-sm text-[#7A3D2A]">
//                     {item.name}
//                   </p>
//                   <p className="font-sans text-xs text-[#a07f61]">
//                     {item.pieces} pieces
//                   </p>
//                 </div>
//                 <p className="font-sans text-sm font-bold text-[#7A3D2A]">
//                   ₹{(item.pieces * item.price).toLocaleString("en-IN")}
//                 </p>
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#BE6E5B]/20">
//             <p className="font-sans text-xs uppercase tracking-widest text-[#a07f61]">
//               Total ({totalPieces} pieces)
//             </p>
//             <p className="font-display text-2xl text-[#7A3D2A]">
//               ₹{totalAmount.toLocaleString("en-IN")}
//             </p>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={handlePlaceOrder}
//           disabled={placing || !allMoqMet}
//           className="w-full bg-[#7A3D2A] text-white py-4 font-sans text-sm tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#5c2d1f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//         >
//           {placing ? "Placing Order..." : "Place Order"}
//         </button>
//       </div>
//     </main>
//   );
// }

// FILE: client/src/app/checkout/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { placeOrder } from "@/lib/api";
import Toast from "@/components/ui/Toast";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user, isAuthenticated, authChecking } = useAuth();
  const { items, totalPieces, totalAmount, allMoqMet, clearCart, hydrated } =
    useCart();

  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  // NEW: shipping address form state
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    alternatePhone: "",
  });
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login?mode=signin&redirect=/checkout");
    }
  }, [authChecking, isAuthenticated, router]);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // NEW: validate address before placing order
  const validateAddress = () => {
    const errors = {};
    if (!address.addressLine1.trim())
      errors.addressLine1 = "Address is required.";
    if (!address.city.trim()) errors.city = "City is required.";
    if (!address.state.trim()) errors.state = "State is required.";
    if (!/^[0-9]{6}$/.test(address.pincode.trim()))
      errors.pincode = "Enter a valid 6-digit pincode.";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!allMoqMet) {
      showToast("Some items do not meet the minimum order quantity.", "error");
      return;
    }
    if (!validateAddress()) {
      showToast("Please fill in a valid shipping address.", "error");
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        buyerName: user?.name,
        buyerEmail: user?.email,
        buyerCompany: user?.company || "",
        shippingAddress: {
          addressLine1: address.addressLine1.trim(),
          addressLine2: address.addressLine2.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
          alternatePhone: address.alternatePhone.trim(),
        },
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          pieces: i.pieces,
        })),
      };
      const res = await placeOrder(token, payload);
      clearCart();
      showToast("Order placed successfully!", "success");
      setTimeout(() => {
        router.push(`/my-orders/${res.order._id}`);
      }, 1200);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to place order.",
        "error",
      );
    } finally {
      setPlacing(false);
    }
  };

  if (authChecking || !hydrated) {
    return (
      <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">
          Loading...
        </p>
      </main>
    );
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-[#BE6E5B]/30 rounded-md font-sans text-sm text-[#574325] focus:outline-none focus:border-[#7A3D2A] bg-white";
  const errorCls = "text-[11px] text-red-600 mt-1 font-sans";

  return (
    <main className="min-h-screen bg-[#f5efe4] px-4 sm:px-6 lg:px-8 py-12">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl text-[#7A3D2A] mb-8">
          Review &amp; Place Order
        </h1>

        <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 mb-6">
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-3">
            Buyer Details
          </h2>
          <p className="font-sans text-sm text-[#7A3D2A]">{user?.name}</p>
          <p className="font-sans text-sm text-[#a07f61]">{user?.email}</p>
          {user?.company && (
            <p className="font-sans text-sm text-[#a07f61]">{user.company}</p>
          )}
        </div>

        {/* NEW: Shipping Address form */}
        <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 mb-6">
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-4">
            Shipping Address
          </h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Address Line 1 (House no, Street, Area) *"
                value={address.addressLine1}
                onChange={(e) =>
                  handleAddressChange("addressLine1", e.target.value)
                }
                className={inputCls}
              />
              {addressErrors.addressLine1 && (
                <p className={errorCls}>{addressErrors.addressLine1}</p>
              )}
            </div>

            <input
              type="text"
              placeholder="Address Line 2 (Landmark, Optional)"
              value={address.addressLine2}
              onChange={(e) =>
                handleAddressChange("addressLine2", e.target.value)
              }
              className={inputCls}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className={inputCls}
                />
                {addressErrors.city && (
                  <p className={errorCls}>{addressErrors.city}</p>
                )}
              </div>
              <div>
                <select
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select State *</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {addressErrors.state && (
                  <p className={errorCls}>{addressErrors.state}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Pincode *"
                  value={address.pincode}
                  onChange={(e) =>
                    handleAddressChange(
                      "pincode",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                  className={inputCls}
                />
                {addressErrors.pincode && (
                  <p className={errorCls}>{addressErrors.pincode}</p>
                )}
              </div>
              <input
                type="tel"
                placeholder="Alternate Phone (Optional)"
                value={address.alternatePhone}
                onChange={(e) =>
                  handleAddressChange(
                    "alternatePhone",
                    e.target.value.replace(/\D/g, ""),
                  )
                }
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 mb-6">
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-4">
            Order Items
          </h2>
          <div className="divide-y divide-[#BE6E5B]/10">
            {items.map((item) => (
              <div
                key={item.productId}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-sans text-sm text-[#7A3D2A]">
                    {item.name}
                  </p>
                  <p className="font-sans text-xs text-[#a07f61]">
                    {item.pieces} pieces
                  </p>
                </div>
                <p className="font-sans text-sm font-bold text-[#7A3D2A]">
                  ₹{(item.pieces * item.price).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#BE6E5B]/20">
            <p className="font-sans text-xs uppercase tracking-widest text-[#a07f61]">
              Total ({totalPieces} pieces)
            </p>
            <p className="font-display text-2xl text-[#7A3D2A]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing || !allMoqMet}
          className="w-full bg-[#7A3D2A] text-white py-4 font-sans text-sm tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#5c2d1f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </main>
  );
}
