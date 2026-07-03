// FILE: client/src/app/operations-center/blog/edit/[id]/layout.js

export const metadata = {
  title: "Edit Blog Post | Operations Center",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditBlogLayout({ children }) {
  return <>{children}</>;
}