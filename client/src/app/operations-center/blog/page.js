// FILE: client/src/app/operations-center/blog/page.js
import { redirect } from "next/navigation";

// /operations-center/blog has no page of its own (only create/ and edit/[id] exist).
// The blog list lives at /operations-center/blogs.
export default function BlogIndexRedirect() {
  redirect("/operations-center/blogs");
}
