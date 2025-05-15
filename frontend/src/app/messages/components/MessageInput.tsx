"use client";

import React, { useState } from "react";
import { Socket } from "socket.io-client";
import EmojiPicker from "@emoji-mart/react";

interface MessageInputProps {
  onSend: (text: string) => void;
  onTyping: () => void;
  socket: Socket; // Add socket as a prop
}

export default function MessageInput({ onSend, onTyping, socket }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;

    const message = {
      text,
      sender: "You",
      timestamp: new Date().toLocaleTimeString(),
    };

    // Emit the message to the backend
    socket.emit("sendMessage", message);

    // Call the onSend callback
    onSend(text);

    setText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTyping(); // Trigger typing indicator
    socket.emit("typing", "You are typing..."); // Notify the backend about typing
  };

  const addEmoji = (emoji: any) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-4 bg-purple-100 border-t border-purple-300 flex items-center gap-4 relative">
      {/* Emoji Picker Button */}
      <button
        className="text-purple-500 hover:text-purple-700"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        😊
      </button>
      {showEmojiPicker && (
        <div className="absolute bottom-12 left-4 z-10">
          <EmojiPicker onEmojiSelect={addEmoji} />
        </div>
      )}

      {/* Input Field */}
      <input
        type="text"
        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      {/* Send Button */}
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}