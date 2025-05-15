"use client";

import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface MessageBubbleProps {
  message: {
    id: string | number; // Ensure id is a string or number
    sender: string;
    avatar: string;
    text: string;
    timestamp: string;
    read: boolean;
  };
  socket: Socket; // Add socket as a prop
  onRead?: () => void; // Add the onRead property
}

const reactions = ["👍", "❤️", "😂", "😮", "😢", "👏"];

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, socket }) => {
  const isSender = message.sender === "You";
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    setShowReactions(false); // Hide the reaction picker after selecting
  
  // Emit the reaction to the backend
  socket.emit("sendReaction", { messageId: message.id, reaction });
};

  return (
    <div className={`flex items-start ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      {!isSender && (
        <img
          src={message.avatar}
          alt={`${message.sender}'s avatar`}
          className="w-8 h-8 rounded-full border-2 border-purple-300 mr-2"
        />
      )}
      <div>
        <div
          className={`p-4 rounded-lg shadow-md ${
            isSender ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-800"
          }`}
        >
          <p>{message.text}</p>
          <span className="text-xs text-purple-300 block mt-2">{message.timestamp}</span>
        </div>
        {isSender && (
          <span className="text-xs text-purple-400 mt-1 block">
            {message.read ? "Read" : "Delivered"}
          </span>
        )}

        {/* Display selected reaction */}
        {selectedReaction && (
          <div className="mt-2 text-lg">
            <span>{selectedReaction}</span>
          </div>
        )}

        {/* Reaction Picker */}
        <div className="relative">
          <button
            className="text-sm text-purple-500 hover:text-purple-700 mt-2"
            onClick={() => setShowReactions(!showReactions)}
          >
            {showReactions ? "Close Reactions" : "React"}
          </button>
          {showReactions && (
            <div className="absolute flex gap-2 mt-2 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
              {reactions.map((reaction) => (
                <button
                  key={reaction}
                  className="text-lg hover:bg-purple-100 rounded-full p-1"
                  onClick={() => handleReaction(reaction)}
                >
                  {reaction}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;