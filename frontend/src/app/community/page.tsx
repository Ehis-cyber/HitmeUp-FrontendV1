'use client';

import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/navbar/TopNavbar';

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = new Date('2025-12-31T23:59:59').getTime();
    const currentTime = new Date().getTime();
    return Math.max(targetDate - currentTime, 0); // Ensure non-negative value
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval); // Stop the timer when it reaches zero
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    if (ms <= 0) return '0d 0h 0m 0s'; // Prevent negative time
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
    const days = Math.floor(ms / 1000 / 60 / 60 / 24);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col">
      <TopNavbar />
      <div className="flex flex-1 flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
        <p className="text-lg mb-4">
          We're working hard to bring this feature to life. Stay tuned for updates!
        </p>
        <div className="text-2xl font-semibold mb-8">
          Launching in: {formatTime(timeLeft)}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => window.history.back()}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Go Back
          </button>
          <a
            href="/tasks"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            View Tasks
          </a>
        </div>
      </div>
      <footer className="text-center py-4 bg-white text-gray-700">
        <p className="text-sm">
          © {new Date().getFullYear()} HitMeUp. All rights reserved.
        </p>
      </footer>
    </div>
  );
}