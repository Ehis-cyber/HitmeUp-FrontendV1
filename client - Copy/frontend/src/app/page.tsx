
//page.tsx
"use client";

import { usePathname } from "next/navigation";
import Hero from "./components/hero/Hero";
import Jobs from "./components/tasks/Jobs";
import TopNavbar from "./components/navbar/TopNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noNavbarRoutes = ["/login", "/signup"];

  return (
    <>
      {/* Conditionally render the navbar */}
      {!noNavbarRoutes.includes(pathname) && <TopNavbar />}

      {/* Render the main content */}
      <main>
        {children}
        <Hero />
        <Jobs />
      </main>
    </>
  );
}