"use client";
import { useState } from "react";
import Link from "next/link";

const tabs = [
  { name: "My Applications", key: "applications" },
  { name: "My Bids", key: "bids" },
  { name: "Posted Tasks", key: "posted" },
  { name: "Assigned Tasks", key: "running" },
];

const renderItemContent = (activeTab: string, item: any) => {
  switch (activeTab) {
    case "applications":
      return (
        <div>
          <h3 className="font-medium text-gray-800">{item.taskTitle || "Application"}</h3>
          <div className="flex flex-wrap gap-x-4 mt-1">
            <span className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{item.status || "pending"}</span></span>
            <span className="text-sm text-gray-600">
              Applied: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      );
    case "bids":
      return (
        <div>
          <h3 className="font-medium text-gray-800">{item.taskTitle || "Bid"}</h3>
          <div className="flex flex-wrap gap-x-4 mt-1">
            <span className="text-sm text-gray-600">Amount: <span className="font-medium">${item.bidAmount || "0"}</span></span>
            <span className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{item.status || "pending"}</span></span>
          </div>
        </div>
      );
    case "posted":
      return (
        <div>
          <h3 className="font-medium text-gray-800">{item.title || "Task"}</h3>
          <div className="flex flex-wrap gap-x-4 mt-1">
            <span className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{item.status || "open"}</span></span>
            <span className="text-sm text-gray-600">Budget: <span className="font-medium">${item.budget || "Not specified"}</span></span>
            {item.assignedTo && (
              <span className="text-sm text-gray-600">Assigned to: <span className="font-medium">{item.assignedToName || "Someone"}</span></span>
            )}
          </div>
        </div>
      );
    case "running":
      return (
        <div>
          <h3 className="font-medium text-gray-800">{item.title || "Task"}</h3>
          <div className="flex flex-wrap gap-x-4 mt-1">
            <span className="text-sm text-gray-600">Due: <span className="font-medium">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No deadline"}</span></span>
            <span className="text-sm text-gray-600">Budget: <span className="font-medium">${item.budget || "Not specified"}</span></span>
            <span className="text-sm text-gray-600">Posted by: <span className="font-medium">{item.postedByName || "Client"}</span></span>
          </div>
        </div>
      );
    default:
      return <pre className="text-sm overflow-x-auto p-2 bg-gray-50 rounded">{JSON.stringify(item, null, 2)}</pre>;
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("applications");
  const [data, setData] = useState<any[]>([]); // Mock data can be added here
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      {/* Navbar */}
      <nav className="bg-purple-800 text-white p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-white text-purple-800 font-medium text-sm rounded-lg shadow hover:bg-gray-100 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </nav>
      
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm md:text-base whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? "border-b-2 border-purple-900 text-purple-600 font-semibold"
                : "text-gray-500 hover:text-lavender-1000 hover:border-gray-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 w-full bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No {tabs.find(t => t.key === activeTab)?.name.toLowerCase()} found</h3>
            <p className="text-gray-500 mt-1">
              {activeTab === "posted"
                ? "You haven't posted any tasks yet."
                : activeTab === "running"
                ? "You don't have any assigned tasks."
                : `You don't have any ${activeTab} yet.`}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {data.map((item) => (
              <li
                key={item.id}
                className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
              >
                {renderItemContent(activeTab, item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}