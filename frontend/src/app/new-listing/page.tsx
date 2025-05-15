'use client';
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import TopNavbar from '../components/navbar/TopNavbar';

export default function ManageTasksPage() {
  const [activeTab, setActiveTab] = useState<'post' | 'tasks'>('tasks'); // Toggle between tabs
  const [tasks, setTasks] = useState<any[]>([]); // Simulated task data
  const [selectedTask, setSelectedTask] = useState<any | null>(null); // Task being edited
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state for authentication check
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  // Helper function to retrieve the token from cookies
  const getTokenFromCookies = () => {
    console.log("All Cookies:", document.cookie); // Log all cookies for debugging
    const token = Cookies.get("token"); // Retrieve token using js-cookie
    console.log("Retrieved Token:", token); // Debugging
    return token;
  };


  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/auth/verify", {
          withCredentials: true, // Include cookies in the request
        });
        console.log("Authentication verified:", res.data);
        setAuthToken(res.data.token); // Store the token in state
      } catch (err) {
        console.error("User is not authenticated:", err);
        router.push("/auth/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/tasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const tasks = await response.json();
        setTasks(Array.isArray(tasks) ? tasks : []); // Ensure tasks is always an array
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (authToken) {
      fetchTasks();
    }
  }, [authToken]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading indicator while checking authentication
  }
  


  // Simulate creating a task
  const handleCreateTask = async (taskData: any) => {
    if (!authToken) {
      setMessage("You must be logged in to create a task.");
      setMessageType("error");
      router.push("/auth/login"); // Redirect to login page
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(taskData).forEach((key) => {
        formData.append(key, taskData[key]);
      });
  
      console.log([...formData.entries()]); // Logs all key-value pairs in the FormData

      // Send the form data to the server
      const response = await fetch("http://localhost:8800/api/tasks", {
        method: "POST",
        headers: {        
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include", // Include cookies in the request
        body: formData,
      });

     // Your fetch call here
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Backend Error:", errorData);
    throw new Error(errorData.message || "Failed to create task");
  }

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
     
      setMessage("Task created successfully!");
      setMessageType("success");

       // Redirect to "Your Tasks" tab
       setActiveTab('tasks');
    } catch (err) {
      console.error("Error creating task:", err);
      setMessage("Failed to create task");
      setMessageType("error");
    }    

  };

//delete a task
const handleDeleteTask = async (taskId: string) => {
  if (!authToken) {
    setMessage("You must be logged in to create a task.");
    setMessageType("error");
    router.push("/auth/login"); // Redirect to login page
    return;
  }
  try {
    const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    setMessage("Task deleted successfully!");
    setMessageType("success");
  } catch (err) {
    console.error("Error deleting task:", err);
    setMessage("Failed to delete task");
    setMessageType("error");
  }
};
//update a task
const handleUpdateTask = async (taskId: string, updatedData: any) => {
  if (!authToken) {
    setMessage("You must be logged in to create a task.");
    setMessageType("error");
    router.push("/auth/login"); // Redirect to login page
    return;
  }

  try {
    const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend Error:", errorData); // Log the error response
      throw new Error("Failed to update task");
    }

    const updatedTask = await response.json();
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
    );
    // Optionally, you can redirect to the "Your Tasks" tab after updating

    setMessage("Task updated successfully!");
    setMessageType("success");
  } catch (err) {
    console.error("Error updating task:", err);
    setMessage("Failed to update task");
    setMessageType("error");
  }
};
   
// Handle editing a task
const handleEditTask = (task: any) => {
  setSelectedTask(task); // Set the task to be edited
  setActiveTab('post'); // Switch to the "Post a New Task" tab
};

  const closeMessage = () => {
    setMessage(null);
    setMessageType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="container mx-auto mt-10 px-4">
        {/* Tabs for navigation */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 font-semibold rounded-t-lg ${
              activeTab === 'tasks'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Your Tasks
          </button>
          <button
            onClick={() =>{
              setSelectedTask(null);//clear selexted task when switching to "Post a New task"
               setActiveTab('post');
            }}
            className={`px-6 py-3 font-semibold rounded-t-lg ${
              activeTab === 'post'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Post a New Task
          </button>
        </div>

        {/* Content */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {activeTab === 'tasks' ? (
            // Your Tasks Section
            <div>
              <h2 className="text-3xl font-semibold text-gray-800">Your Tasks</h2>
              <p className="text-gray-500 mt-2 mb-6">
                Manage your tasks and find help for your errands.
              </p>
              {Array.isArray(tasks) && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id || task._id}
                      className="bg-gray-100 shadow-sm rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{task.taskTitle}</h3>
                        <p className="text-gray-500 text-sm">{task.jobDescription}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-purple-400 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id ||task._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-700">
                  No tasks found. Start by creating a new task!
                </div>
              )}
            </div>
          ) : (
             // Post a New Task Section
             <div>
             <h2 className="text-3xl font-semibold text-gray-800">
               {selectedTask ? 'Edit Task' : 'Post a New Task'}
             </h2>
             <p className="text-gray-500 mt-2 mb-4">
               {selectedTask
                 ? 'Update the details below to edit your task.'
                 : 'Fill in the details below to create a new task.'}
             </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);

                  const taskData: any = {};
                  formData.forEach((value, key) => {
                    taskData[key] = value;
                  });

                  if (selectedTask) {
                    console.log("Updating Task:", selectedTask);
                    console.log("Task Data:", taskData);
                    handleUpdateTask(selectedTask.id || selectedTask._id, taskData);
                  } else {
                    console.log("Creating Task:");
                    console.log("Task Data:", taskData);
                    handleCreateTask(taskData);
                  }
                  form.reset();
                }}
                className="space-y-4"
              >

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    type="text"
                    name="taskTitle"
                    required
                    placeholder="e.g., Grocery Shopping"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Description</label>
                  <textarea
                    name="jobDescription"
                    required
                    placeholder="e.g., Buy groceries from the local store and deliver them to my home."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g., HTML, CSS, JavaScript"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Range</label>
                  <input
                    type="text"
                    name="payment"
                    placeholder="e.g., 5000 - 10000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g., 2 weeks"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    placeholder="e.g., John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taskers Needed</label>
                  <input
                    type="number"
                    name="taskersNeeded"
                    placeholder="e.g., 1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Remote"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Electrical">Full-Time</option>
                    <option value="Electrical">Part-Time</option>
                    <option value="Electrical">Contract</option>
                    <option value="Tailoring">Tailoring</option>
                    <option value="Tech">Tech</option>
                    <option value="Food Delivery">Food Delivery</option>
                    <option value="Errands">Errands</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Mechanics">Mechanics</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Moving">Moving</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Health">Health</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
      <label className="block text-sm font-medium text-gray-700">Experience Level</label>
      <p className="text-sm text-gray-500 mb-2">
    Select the experience level required for this task. This helps taskers understand the expectations.
  </p>
      <select
       name="experience"
       required
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
      <option value="novice">Novice</option>
      <option value="junior">Junior</option>
      <option value="mid-level">Mid-Level</option>
      <option value="senior">Senior</option>
      </select>
      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload File (Optional)</label>
                  <input
                    type="file"
                    name="file"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  </div>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition-colors"
                >
                    {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg shadow ${
              messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{message}</span>
              <button
                onClick={closeMessage}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}