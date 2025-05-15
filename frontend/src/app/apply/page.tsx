"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import TopNavbar from "../components/navbar/TopNavbar";

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    nin: "",
    portfolio: "",
    resume: "",
  });

  const [suggestions, setSuggestions] = useState<{ formatted: string; components: { city?: string; town?: string; village?: string; state?: string; country?: string } }[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const router = useRouter();
  const OPEN_CAGE_API_KEY = "ed6a839da98f468dad7dfee1be5cad64"; // Replace with your OpenCage API key

  let debounceTimeout: NodeJS.Timeout | undefined;

  // Fetch suggestions from OpenCage API
  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${OPEN_CAGE_API_KEY}`
      );
      const data = await response.json();
      if (data.results) {
        setSuggestions(data.results.slice(0, 5)); // Limit to 5 suggestions
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle input changes for all fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Fetch suggestions for city, state, or country
    if (name === "city" || name === "state" || name === "country") {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        if (value.length > 2) {
          fetchSuggestions(value);
        } else {
          setSuggestions([]);
        }
      }, 300);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: { components: { city?: string; town?: string; village?: string; state?: string; country?: string } }) => {
    const { components } = suggestion;
    setFormData((prev) => ({
      ...prev,
      city: components.city || components.town || components.village || "",
      state: components.state || "",
      country: components.country || "",
    }));
    setSuggestions([]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.nin) {
      setShowWarning(true);
      setLoading(false);
      return;
    }

    try {
      // Save form data to Firestore
      await addDoc(collection(firestore, "jobApplications"), formData);

      // Send email (optional)
      await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });

      // Show success message and reset form
      setSuccessMessage("Your application has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        country: "",
        nin: "",
        portfolio: "",
        resume: "",
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSuccessMessage("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Application Form</h1>
          {successMessage && (
            <div
              className={`p-4 mb-4 rounded ${
                successMessage.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {successMessage}
            </div>
          )}
          {showWarning && (
            <div className="p-4 mb-4 bg-yellow-100 text-yellow-700 rounded">
              Please fill out all required fields.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="w-full p-2 border rounded"
              required
            />

            {/* Country */}
            <div className="relative">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="w-full p-2 border rounded"
              />
              {suggestions.length > 0 && formData.country.length > 2 && (
                <div className="absolute bg-white border rounded mt-1 w-full z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      {suggestion.formatted}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* State */}
            <div className="relative">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="w-full p-2 border rounded"
              />
              {suggestions.length > 0 && formData.state.length > 2 && (
                <div className="absolute bg-white border rounded mt-1 w-full z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      {suggestion.formatted}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* City */}
            <div className="relative">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full p-2 border rounded"
              />
              {suggestions.length > 0 && formData.city.length > 2 && (
                <div className="absolute bg-white border rounded mt-1 w-full z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      {suggestion.formatted}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NIN */}
            <input
              type="text"
              name="nin"
              value={formData.nin}
              onChange={handleInputChange}
              placeholder="National ID Number"
              className="w-full p-2 border rounded"
              required
            />

            {/* Portfolio */}
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="Portfolio URL (Optional)"
              className="w-full p-2 border rounded"
            />

            {/* Resume */}
            <input
              type="url"
              name="resume"
              value={formData.resume}
              onChange={handleInputChange}
              placeholder="Resume URL (Optional)"
              className="w-full p-2 border rounded"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full p-2 text-white font-medium rounded-md ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}