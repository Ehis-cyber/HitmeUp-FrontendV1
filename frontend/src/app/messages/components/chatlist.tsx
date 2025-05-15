"use client";

import React, { useState } from "react";

export default function ChatList() {
  const [query, setQuery] = useState("");

  const conversations = [
    { id: 1, name: "John Doe", avatar: "/avatars/john.jpg", lastMessage: "Hey, is the gig still available?", timestamp: "2h ago" },
    { id: 2, name: "Jane Smith", avatar: "/avatars/user2.jpg", lastMessage: "Thanks for the update!", timestamp: "1d ago" },
  ];

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        placeholder="Search chats..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="space-y-4">
        {filteredConversations.map((conversation) => (
          <li
            key={conversation.id}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
          >
            <img
              src={conversation.avatar}
              alt={`${conversation.name}'s avatar`}
              className="w-12 h-12 rounded-full border-2 border-purple-300"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{conversation.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
            </div>
            <span className="text-xs text-gray-400">{conversation.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}