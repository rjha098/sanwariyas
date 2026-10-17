// FILE: client/src/app/operations-center/(dashboard)/page.js
import { redirect } from "next/navigation";
import DashboardOverview from "@/components/admin/DashboardOverview";

// Old bookmarks and links used /operations-center?tab=<section>. Redirect them to the
// dedicated routes before anything renders, so there is no flash of the wrong page.
const LEGACY_TAB_ROUTES = {
  products: "/operations-center/products",
  inquiries: "/operations-center/inquiries",
  orders: "/operations-center/orders",
  blogs: "/operations-center/blogs",
  lookbook: "/operations-center/lookbook",
};

export default async function OperationsCenterHome({ searchParams }) {
  // Next 15+ delivers searchParams as a Promise.
  const params = await searchParams;
  const tab = Array.isArray(params?.tab) ? params.tab[0] : params?.tab;
  const target = LEGACY_TAB_ROUTES[tab];

  if (target) {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    // The old highlighted-inquiry link was ?tab=inquiries&id=<id>.
    redirect(tab === "inquiries" && id ? `${target}?id=${encodeURIComponent(id)}` : target);
  }

  return <DashboardOverview />;
}