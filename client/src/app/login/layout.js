// FILE: client/src/app/login/layout.js

export const metadata = {
  title: "Login / Sign Up | SANWARIYAS Ethnic Luxury",
  description: "Sign in to access your SANWARIYAS wholesale dashboard or create a new account for exclusive B2B ethnic luxury manufacturing.",
  alternates: { canonical: "https://www.yourdomain.com/login" }, // Replace with your actual live domain
  openGraph: {
    title: "Login / Sign Up | SANWARIYAS",
    description: "Access your SANWARIYAS wholesale dashboard or join us for exclusive ethnic luxury.",
    url: "https://www.yourdomain.com/login",
    siteName: "SANWARIYAS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login / Sign Up | SANWARIYAS",
    description: "Access your SANWARIYAS wholesale dashboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({ children }) {
  return <>{children}</>;
}