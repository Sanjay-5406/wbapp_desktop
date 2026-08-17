// app/about/page.tsx
import AboutClient from "@/app/about/AboutClient";

export const metadata = {
  title: "About Us | Cloud Core",
  description: "Learn about our platform, hardware architecture, and vision.",
};

export default function AboutPage() {
  return <AboutClient />;
}