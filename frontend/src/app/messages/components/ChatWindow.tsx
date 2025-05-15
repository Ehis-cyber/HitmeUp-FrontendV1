"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

const socket = io("http://localhost:8800"); // Connect to the backend


export default function ChatWindow() {
  const [messages, setMessages] = useState<{ id: string | number; sender: string; text: string; avatar: string; timestamp: string; read: boolean }[]>([]);

  //fetxh n=messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/messages", {
          credentials: "include", // Include cookies for authentication
        });
        const data = await response.json();
         // Ensure all message IDs are strings
      const formattedMessages = data.map((message: any) => ({
        ...message,
        id: String(message.id), // Convert `id` to string
      }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
  
    fetchMessages();
  }, []);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => {
       // Check if the message already exists
      const exists = prevMessages.some((msg) => msg.id === message.id);
      if (exists) return prevMessages;
       // Add the new message
        return [
        ...prevMessages,
        { ...message, id: String(message.id), avatar: message.avatar || "avatars/you.jpg" }, // Ensure `id` is a string
        ];
    });
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);
    
    useEffect(() => {
      socket.on("messageRead", (messageId) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      });

      return () => {
        socket.off("messageRead");
      };
    }, []);

    const handleReadMessage = (messageId: string) => {
      socket.emit("markAsRead", messageId);
    };

  
    const markAsRead = async (messageId: number) => {
      try {
        await fetch(`http://localhost:8800/api/messages/${messageId}/read`, {
          method: "PUT",
          credentials: "include",
        });
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      } catch (err) {
        console.error("Failed to mark message as read:", err);
      }
    };

    

  const handleSendMessage = async (text: string, receiverId: string) => {
    const newMessage = {
      id: uuidv4(), // Generate a unique ID // Generate a unique ID for the message
      sender: "loggedInUserId", // Replace with actual logged-in user ID
      receiver: receiverId,
      text,
      avatar: "avatars/you.jpg", // Default avatar
      timestamp: new Date().toLocaleTimeString(),
      read: false,
    };
   
    // Emit the message to the backend
    socket.emit("sendMessage", newMessage);
  

    // Add the message to the local state
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

 
  

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 bg-purple-500 text-white flex items-center gap-4">
        <h2 className="text-lg font-bold">Chat</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} socket={socket} 
            onRead={() =>handleReadMessage(String(message.id))} />
        ))}
        <TypingIndicator socket={socket} />
      </div>

      {/* Message Input */}
      <MessageInput onSend={(text) => handleSendMessage(text, "defaultReceiverId")} onTyping={() => {}} socket={socket} />
    </div>
  );
}