// FILE: client/src/app/operations-center/inquiries/[id]/layout.js

export const metadata = {
  title: "Inquiry Details | Operations Center",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InquiryDetailsLayout({ children }) {
  return <>{children}</>;
}