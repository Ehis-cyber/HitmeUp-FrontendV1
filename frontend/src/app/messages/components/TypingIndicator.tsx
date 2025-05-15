"use client";

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface TypingIndicatorProps {
  socket: Socket; // Add socket as a prop
}

export default function TypingIndicator({ socket }: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    // Listen for typing events from the backend
    socket.on("userTyping", (user) => {
      setTypingUsers((prev) => [...prev, user]);

      // Remove the user after 2 seconds
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== user));
      }, 2000);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("userTyping");
    };
  }, [socket]);

  if (typingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-purple-500 text-sm italic mt-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
      </div>
      <span>
        {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
      </span>
    </div>
  );
}