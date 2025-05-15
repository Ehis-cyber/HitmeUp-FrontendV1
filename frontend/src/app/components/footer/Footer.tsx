'use client';

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-700 to-purple-900 text-gray-300 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Categories Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            <li>
              <a href="/tasks" className="hover:text-purple-300 transition">
                Errands
              </a>
            </li>
            <li>
              <a href="/tasks" className="hover:text-purple-300 transition">
                Home Services
              </a>
            </li>
            <li>
              <a href="/tasks" className="hover:text-purple-300 transition">
                Freelance Gigs
              </a>
            </li>
            <li>
              <a href="/tasks" className="hover:text-purple-300 transition">
                Delivery Services
              </a>
            </li>
          </ul>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">About</h3>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:text-purple-300 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:text-purple-300 transition">
                Careers
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-purple-300 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="/press" className="hover:text-purple-300 transition">
                Press
              </a>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="/help" className="hover:text-purple-300 transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-purple-300 transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-purple-300 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-purple-300 transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Community Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Community</h3>
          <ul className="space-y-2">
            <li>
              <a href="/community" className="hover:text-purple-300 transition">
                Forums
              </a>
            </li>
            <li>
              <a href="/events" className="hover:text-purple-300 transition">
                Events
              </a>
            </li>
            <li>
              <a href="/ambassadors" className="hover:text-purple-300 transition">
                Ambassadors
              </a>
            </li>
            <li>
              <a href="/partners" className="hover:text-purple-300 transition">
                Partnerships
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Tagline Section */}
      <div className="mt-10 border-t border-purple-600 pt-6 text-center">
      <p className="text-xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
            "HitMeUp!- anywork, anywhere, anytime!"
          </p>
        </div>
    </footer>
  );
}