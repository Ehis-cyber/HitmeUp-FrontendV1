"use client";

import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "@nextui-org/react"; // Ensure this is imported
import { FaWallet, FaEnvelope, FaBell, FaPlus, FaSignInAlt, FaBars } from "react-icons/fa";
import NavLink from "./NavLink";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import newRequest from "@/app/utils/newRequest";

export default function TopNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const[active, setActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu
  const [open, setOpen] = useState(false); // State for dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown menu
  const router = useRouter();

  // Simulated current user (replace with actual user data)
  const currentUser = {
    name: "Jane Doe",
    profilePicture: "/images/pic.jpg", // Replace with actual profile picture URL
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await newRequest.get("/api/auth/me");
        setIsLoggedIn(true);
        setIsVerified(res.data.isVerified);
        setProfilePicture(res.data.profilePicture || "/default-profile.png");
      } catch (err) {
        setIsLoggedIn(false);
        setIsVerified(false);
        setProfilePicture("/default-profile.png");
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setActive(true); // Set active when scrolled down
      } else {
        setActive(false); // Reset active when at the top
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout", {}, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setIsVerified(false);
      setProfilePicture("/default-profile.png");
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Navbar
      isBordered
      className={`sticky top-0 z-50 transition-all duration-300 ${
        active ? "bg-purple-600 shadow-lg text-white" : "bg-transparent text-black"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-black-600 cursor-pointer font-['AldransAltW00-Medium']">hitmeup!</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 " >
          <NavLink href="/dashboard" label="Dashboard" className="text-black" />
          <NavLink href="/community" label="Community" className="text-black"/>
          <NavLink href="/tasks" label="Find a Task" className="text-black"/>
          <NavLink href="/auth/login" label="Sign-in" className="text-black"/>
        </div>

        {/* Icons and Profile Section */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/wallet">
            <div
              className="flex items-center justify-center rounded-full w-10 h-10 text-gray-600 hover:bg-gray-100 cursor-pointer"
              title="Wallet"
              aria-label="Wallet"
            >
              <FaWallet className="text-lg" />
            </div>
          </Link>
          <Link href="/messages">
            <div
              className="flex items-center justify-center rounded-full w-10 h-10 text-gray-600 hover:bg-gray-100 cursor-pointer"
              title="Messages"
              aria-label="Messages"
            >
              <FaEnvelope className="text-lg" />
            </div>
          </Link>
          <Link href="/notification">
            <div
              className="flex items-center justify-center rounded-full w-10 h-10 text-gray-600 hover:bg-gray-100 cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <FaBell className="text-lg" />
            </div>
          </Link>
          <Link href="/new-listing">
            <div
              className="flex items-center justify-center rounded-full w-10 h-10 text-gray-600 hover:bg-gray-100 cursor-pointer"
              title="New Listing"
              aria-label="New Listing"
            >
              <FaPlus className="text-lg" />
            </div>
          </Link>

         {/* Profile Section */}
            <div className="relative flex items-center space-x-2">
              <img
                src={currentUser.profilePicture}
                alt="User Profile"
                className="rounded-full w-10 h-10 object-cover cursor-pointer border-2 border-gray-200 hover:border-purple-500"
                onClick={() => {
                  setOpen((prev) => !prev); // Toggle the dropdown menu
                  console.log("Dropdown toggled:", !open); // Debugging
                }}
                title="User Profile"
                aria-label="User Profile"
              />
               <span className="text-xs font-medium text-gray-700">{currentUser.name}</span>  
              {open && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-full mt-2 w-48 max-w-full bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden"
                >
                  <Link
                    href="/tasks"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    title="Tasks"
                    aria-label="Tasks"
                  >
                    Tasks
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    title="Profile"
                    aria-label="Profile"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    title="Settings"
                    aria-label="Settings"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/applications-bids"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    title="My Applications and Bids"
                    aria-label="My Applications and Bids"
                  >
                     Applications
                     & Bids
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    title="Logout"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            </div>
                


        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-full"
          onClick={toggleMobileMenu}
          title="Toggle Menu"
          aria-label="Toggle Menu"
        >
          <FaBars className="text-lg" />
        </button>
      </div>

      {/* Mobile Navigation Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-2 px-4 py-3">
            <NavLink href="/dashboard" label="Dashboard" className="text-black"/>
            <NavLink href="/community" label="Community" className="text-black"/>
            <NavLink href="/tasks" label="Find a Task" className="text-black"/>
            <Link href="/wallet">
              <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <FaWallet className="text-lg" />
                <span>Wallet</span>
              </div>
            </Link>
            <Link href="/messages">
              <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <FaEnvelope className="text-lg" />
                <span>Messages</span>
              </div>
            </Link>
            <Link href="/notification">
              <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <FaBell className="text-lg" />
                <span>Notifications</span>
              </div>
            </Link>
            <Link href="/new-listing">
              <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <FaPlus className="text-lg" />
                <span>New Listing</span>
              </div>
            </Link>
            {isLoggedIn && isVerified ? (
              <>
                <Link href="/profile">
                  <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <span>Profile</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-blue-600"
                  title="Logout"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login">
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-blue-700"
                  title="Sign In"
                  aria-label="Sign In"
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>
           {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 hover:bg-purple-500 rounded-full"
          onClick={toggleMobileMenu}
          title="Toggle Menu"
          aria-label="Toggle Menu"
        >
          <FaBars className="text-lg" />
        </button>
        </div>
      )}
    </Navbar>
  );
}