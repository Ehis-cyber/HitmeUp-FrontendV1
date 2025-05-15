"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth } from "firebase/auth";
import { firestore } from "../firebase/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function BidPage() {
  const [proposedWage, setProposedWage] = useState("");
  const [proposedDuration, setProposedDuration] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const taskTitle = searchParams.get("taskTitle");
  const wageRange = searchParams.get("wageRange");
  const taskDuration = searchParams.get("duration");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!taskId) {
      setMessage("Invalid task. Redirecting...");
      setTimeout(() => router.push("/tasks"), 2000);
    }
  }, [taskId, router]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("You need to be logged in to place a bid.");
      return;
    }

    try {
      const bidsRef = collection(firestore, "bids");

      // Check if the user has already placed a bid for this task
      const existingBidQuery = query(
        bidsRef,
        where("taskId", "==", taskId),
        where("userId", "==", user.uid)
      );

      const existingBids = await getDocs(existingBidQuery);
      if (!existingBids.empty) {
        setMessage("You have already placed a bid for this task.");
        return;
      }

      // Add the bid to Firestore
      const bidData = {
        taskId,
        taskTitle,
        userId: user.uid,
        proposedWage: parseFloat(proposedWage),
        proposedDuration,
        createdAt: new Date(),
        userVerified: user.emailVerified, // Prioritize verified users
        userRating: 4.5, // Example: Fetch user rating from Firestore
      };

      await addDoc(bidsRef, bidData);

      setMessage("Bid placed successfully!");
      router.push(`/task/${taskId}`);  // Ensure correct path
    } catch (error) {
      console.error("Error placing bid:", error);
      setMessage("Failed to place bid. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Place a Bid for "{taskTitle}"
        </h2>
        {message && (
          <div
            className={`p-2 rounded mb-4 ${
              message.includes("successfully")
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handlePlaceBid}>
          <div className="mb-4">
            <label
              htmlFor="proposedWage"
              className="block text-sm font-medium text-gray-700"
            >
              Proposed Wage (Range: {wageRange})
            </label>
            <input
              type="number"
              id="proposedWage"
              value={proposedWage}
              onChange={(e) => setProposedWage(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="proposedDuration"
              className="block text-sm font-medium text-gray-700"
            >
              Proposed Duration (Original: {taskDuration})
            </label>
            <input
              type="text"
              id="proposedDuration"
              value={proposedDuration}
              onChange={(e) => setProposedDuration(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Place Bid
          </button>
        </form>
      </div>
    </div>
  );
}
