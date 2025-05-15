"use client";

import React, { useState } from "react";
import ChatList from "./components/chatlist";
import ChatWindow from "./components/ChatWindow";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 dark:bg-gray-800 flex flex-col justify-between border-r">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-300">ChatterBox</h1>
          <button
            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 w-full"
            onClick={() => router.push("/")} // Navigate back to the home page
          >
            Home
          </button>
        </div>
        <ChatList />
        <div className="p-4">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 w-full"
            onClick={toggleDarkMode}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-3/4">
        <ChatWindow />
      </div>
    </div>
  );
}