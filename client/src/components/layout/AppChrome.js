// // FILE: client/src/components/layout/AppChrome.js
// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
// import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
// import InquiryWidget from "@/components/ui/InquiryWidget";
// import InquiryModal from "@/components/ui/InquiryModal";

// export default function AppChrome({ children }) {
//   const pathname = usePathname();
//   const isAdminRoute = pathname?.startsWith("/operations-center");

//   if (isAdminRoute) {
//     // Operations Center renders its own AdminHeader + NotificationBell.
//     return <>{children}</>;
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="flex-grow pt-[80px]">{children}</div>
//       <WhatsAppWidget />
//       <InquiryWidget />
//       <InquiryModal />
//     </>
//   );
// }



// FILE: client/src/components/layout/AppChrome.js
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import InquiryWidget from "@/components/ui/InquiryWidget";
import InquiryModal from "@/components/ui/InquiryModal";
import PushNotificationPrompt from "@/components/ui/PushNotificationPrompt";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/operations-center");

  if (isAdminRoute) {
    // Operations Center renders its own AdminHeader + NotificationBell.
    return (
      <>
        {children}
        <PushNotificationPrompt />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex-grow pt-[80px]">{children}</div>
      <WhatsAppWidget />
      <InquiryWidget />
      <InquiryModal />
      <PushNotificationPrompt />
    </>
  );
}
