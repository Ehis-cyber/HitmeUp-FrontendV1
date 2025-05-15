"use client";
import React, { useState } from "react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8800/api/user/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings.");
      }

      setMessage("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("Failed to update settings.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Account Information</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your new password"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
        <form className="space-y-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="emailNotifications" />
            <label htmlFor="emailNotifications" className="text-sm text-gray-700">
              Email Notifications
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="smsNotifications" />
            <label htmlFor="smsNotifications" className="text-sm text-gray-700">
              SMS Notifications
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Preferences
          </button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
        <p className="text-sm text-gray-700">
          Deleting your account is permanent and cannot be undone. All your data will be lost.
        </p>
        <button
          onClick={() => confirm("Are you sure you want to delete your account?")}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}