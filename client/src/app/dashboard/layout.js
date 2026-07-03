// FILE: client/src/app/dashboard/layout.js

export const metadata = {
  title: "My Dashboard | SANWARIYAS B2B Wholesale",
  description: "Manage your B2B wholesale inquiries, track orders, and update your profile on the SANWARIYAS ethnic wear dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}