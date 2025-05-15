"use client";

import Hero from "./components/hero/Hero";
import Jobs from "./components/tasks/Jobs";
import FeaturedSlider from "./components/home/FeaturedSlider";
import { usePathname } from "next/navigation";
import TopNavbar from "./components/navbar/TopNavbar";
import SideBox from "./components/tasks/Sidebox";
import Footer from "./components/footer/Footer"; // Import Footer
import FeaturePage from "./components/feature/FeautureSection";
import ProtectedRoute from "./components/protected/ProtectedRoute"; // Import ProtectedRoute


const noNavbarRoutes = ["/login", "/signup"];

export default function HomePage() {
  const pathname = usePathname(); // Move usePathname inside the component

  return (
    <ProtectedRoute>
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      {/* Only show the navbar if the current route is not in noNavbarRoutes */}
      {!noNavbarRoutes.includes(pathname) && <TopNavbar />}
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <FeaturedSlider />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <FeaturePage />
          </div>
          {/* Main Content */}
          <div className="md:col-span-2">
            <Jobs />
          </div>
          {/* Sidebar */}
          <div>
            <SideBox />
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </ProtectedRoute>
  );
}