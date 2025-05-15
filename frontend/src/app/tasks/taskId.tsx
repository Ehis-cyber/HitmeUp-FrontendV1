"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import TopNavbar from "../components/navbar/TopNavbar";
import api from "../utils/newRequest"; // Axios instance for API requests

const TaskDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  // Extract task ID from the query parameters
  const taskId = searchParams.get("id");

  useEffect(() => {
    const fetchTaskDetail = async () => {
      if (taskId) {
        try {
          setLoading(true);
          const response = await api.get(`/tasks/${taskId}`); // Fetch task details from the backend
          setTask(response.data);
          setError(null); // Clear any previous error
        } catch (error: any) {
          console.error("Error fetching task details:", error);
          setError("Failed to fetch task details. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTaskDetail();
  }, [taskId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!task) {
    return <div className="text-center text-gray-500">Task not found</div>;
  }

  return (
    <>
      <TopNavbar />
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
        <p className="text-lg font-medium">Posted by: {task.companyName}</p>
        <p className="text-gray-500 text-sm mt-2">
          Posted on: {new Date(task.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-4 text-gray-700">{task.jobDescription}</p>
        <p className="mt-2 text-lg font-semibold">Payment: ₦{task.payment}</p>
        <p className="mt-2 text-lg font-semibold">Location: {task.location}</p>
        <p className="mt-2 text-lg font-semibold">
          Skills Required: {task.skills.join(", ")}
        </p>
      </div>
    </>
  );
};

export default TaskDetailPage;