
// // FILE: client/src/components/layout/AppChrome.js
// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
// import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
// import InquiryWidget from "@/components/ui/InquiryWidget";
// import InquiryModal from "@/components/ui/InquiryModal";
// import PushNotificationPrompt from "@/components/ui/PushNotificationPrompt";

// export default function AppChrome({ children }) {
//   const pathname = usePathname();
//   const isAdminRoute = pathname?.startsWith("/operations-center");
//   const isConversationPage = /^\/my-inquiries\/[^/]+/.test(pathname || "");

//   if (isAdminRoute) {
//     // Operations Center renders its own AdminHeader + NotificationBell.
//     return (
//       <>
//         {children}
//         <PushNotificationPrompt />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="flex-grow pt-[80px]">{children}</div>
//       {!isConversationPage && <WhatsAppWidget />}
//       {!isConversationPage && <InquiryWidget />}
//       <InquiryModal />
//       <PushNotificationPrompt />
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
  const isConversationPage = /^\/my-inquiries\/[^/]+/.test(pathname || "");

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
      {!isConversationPage && <WhatsAppWidget />}
      {!isConversationPage && <InquiryWidget />}
      <InquiryModal />
      <PushNotificationPrompt />
    </>
  );
}