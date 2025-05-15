"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNavbar from "../components/navbar/TopNavbar";
import SearchForm from "./Searchform";
import axios from "axios";
import LocationSearch from "./locationSearch";

interface Task {
  id: string;
  _id?: string; // Add _id as an optional property
  companyLogo_userimage: string;
  companyName: string;
  createdAt: string;
  taskTitle: string;
  jobDescription: string;
  location: string;
  category: string;
  taskersNeeded: number;
  duration: string;
  skills: string[];
  favorite: boolean;
  bidAvailable: boolean;
  payment: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    employmentType: [] as string[],
    salaryRange: [0, 200000] as [number, number],
    keyword: "",
    jobType: "",
    location: "",
    duration: [] as string[],
  });

  const router = useRouter();

  const fetchTasks = async (filters: {}) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8800/api/tasks", {
        params: filters, // Send filters as query parameters
        withCredentials: true, // Include cookies in the request
      });
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching tasks:", error.response || error.message);
      } else {
        console.error("Error fetching tasks:", error);
      }
      alert("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  type FiltersType = typeof filters;
  const handleFilterChange = (filters: FiltersType) => {
    setFilters(filters);//update filters  state
    fetchTasks(filters); // Fetch filtered tasks from the backend
  };

  const handleCheckboxChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: (prevFilters[key as keyof typeof filters] as string[]).includes(value)
        ? (prevFilters[key as keyof typeof filters] as string[]).filter((item: string) => item !== value)
        : [...(prevFilters[key as keyof typeof filters] as string[]), value],
    }));
  };


  // Apply filters to tasks
  useEffect(() => {
    const applyFilters = () => {
      let filtered = tasks;

      // Filter by employment type
      if (filters.employmentType.length > 0) {
        filtered = filtered.filter((task) =>
          filters.employmentType.includes(task.category)
        );
      }

      // Filter by location
      if (filters.location.length > 0) {
        filtered = filtered.filter((task) =>
          filters.location.includes(task.location)
        );
      }

      // Filter by duration
      if (filters.duration.length > 0) {
        filtered = filtered.filter((task) =>
          filters.duration.includes(task.duration)
        );
      }

      // Filter by salary range
      filtered = filtered.filter(
        (task) =>
          parseInt(task.payment) >= filters.salaryRange[0] &&
          parseInt(task.payment) <= filters.salaryRange[1]
      );

      // Filter by keyword
      if (filters.keyword) {
        filtered = filtered.filter((task) =>
          task.taskTitle.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }

      setFilteredTasks(filtered);
    };

    applyFilters();
  }, [filters, tasks]);

   // Fetch tasks from the backend
   useEffect(() => {
    fetchTasks({});
  }, []);


  const handleTaskClick = (task: Task) => {
    setSelectedTask(task); // Set the selected task
  };

  const handleClosePopup = () => {
    setSelectedTask(null); // Close the pop-up box
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Application submitted!");
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(); // Format as MM/DD/YYYY or based on locale
    }
  };

   const handleLocationSelect = (location: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      location,
    }));
  };
  const handleKeywordChange = (keyword: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      keyword,
    }));
  };
  const handleJobTypeChange = (jobType: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      jobType,
    }));
  };
  const handleExperienceChange = (experience: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      experience,
    }));
  };
  const handleSearch = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/tasks/search", {
      params: {
        ...filters,
      },
      withCredentials: true,
    });
    setFilteredTasks(response.data);
  } catch (error) {
    console.error("Error searching tasks:", error);
    alert("Failed to search tasks. Please try again later.");
  }
};
  
 useEffect(() => {
    handleSearch(); // Automatically search when filters change
  }, [filters]);

  return (
    <>
      <TopNavbar />
      <SearchForm onFilterChange={handleFilterChange} onSearch={handleSearch}
        onKeywordChange={handleKeywordChange}
        onJobTypeChange={handleJobTypeChange}
        onExperienceChange={handleExperienceChange}/>
       <LocationSearch onLocationSelect={handleLocationSelect} />
      <div className="w-full max-w-screen-xl mx-auto px-5 py-8 flex flex-col lg:flex-row gap-6">
        {/* Filters Panel */}
        <div className="w-full lg:w-64 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Filters</h3>

          {/* Employment Type Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Employment Type</h4>
            <ul className="space-y-2">
              {["Full Time", "Part Time", "Artisan", "Errands", "Contract"].map((type) => (
                <li key={type}>
                  <label className="flex items-center gap-2">
                    <input
                      title="Adjust salary range"
                      placeholder="Enter value"
                      type="checkbox"
                      checked={filters.employmentType.includes(type)}
                      onChange={() =>
                        handleCheckboxChange(
                          "employmentType", type)}
                      className="w-5 h-5 border-gray-300 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>{type}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Location</h4>
            <ul className="space-y-2">
              {["Remote", "Lagos", "Abuja","Port Harcourt"].map((location) => (
                <li key={location}>
                  <label className="flex items-center gap-2">
                    <input
                              type="checkbox"
                              checked={filters.location.includes(location)}
                              onChange={() => handleCheckboxChange("location", location)}
                              className="w-5 h-5 border-gray-300 rounded text-emerald-500 focus:ring-emerald-500"
                              title={`Filter by ${location}`} /* Added title attribute */
                            />
                    <span>{location}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Duration Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Duration</h4>
            <ul className="space-y-2">
              {["1 hour", "1 day", "4 week", "3 months", "6 months", "other"].map((duration) => (
                <li key={duration}>
                  <label className="flex items-center gap-2">
                    <input
                              type="checkbox"
                              checked={filters.duration.includes(duration)}
                              onChange={() => handleCheckboxChange ("duration", duration)}
                              className="w-5 h-5 border-gray-300 rounded text-emerald-500 focus:ring-emerald-500"
                              title={`Filter by ${duration}`} /* Added title attribute */
                            />
                    <span>{duration}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Salary Range Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Salary Range</h4>
            <input
              type="range"
              min="0"
              max="200000"
              value={filters.salaryRange[0]}
              onChange={(e) =>
                setFilters((prevFilters) =>({
                  ...prevFilters,
                  salaryRange: [Math.min(parseInt(e.target.value), prevFilters.salaryRange[1]), prevFilters.salaryRange[1]],
                }))
              }
              className="w-full"
              title="Adjust minimum salary range"
              placeholder="Minimum salary range"
            />
            <input
              type="range"
              min="0"
              max="200000"
              value={filters.salaryRange[1]}
              onChange={(e) =>
                setFilters((prevFilters) =>({
                  ...prevFilters,
                  salaryRange: [prevFilters.salaryRange[0], Math.max(parseInt(e.target.value), prevFilters.salaryRange[0])],
                }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>₦{filters.salaryRange[0]}</span>
              <span>₦{filters.salaryRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1">
          {/* Sorting Dropdown */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800"></h3>
            <select
              onChange={(e) => {
                const sortOrder = e.target.value;
                const sortedTasks = [...filteredTasks].sort((a, b) => {
                  if (sortOrder === "newest") {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  } else {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  }
                });
                setFilteredTasks(sortedTasks);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading tasks...</div>
          ) : filteredTasks.length > 0 ? (
            <div className="flex flex-col gap-6">
          { filteredTasks.map((task) => (
            <div
                 key={task.id || task._id} // Use task.id if available, otherwise fallback to index
                  onClick={() => handleTaskClick(task)}
                  className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col justify-between cursor-pointer"
                >
                  <h4 className="font-bold text-lg text-gray-800 mb-2">{task.taskTitle}</h4>
                  <p className="text-gray-600">{task.jobDescription}</p>
                  <p className="text-gray-600">
                    Posted by: <span className="font-medium">{task.companyName}</span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Posted on: {formatDate(task.createdAt)}
                     {/* Use the formatDate function */}
                  </p>
                  <p className="text-gray-700 mt-2">Payment: ₦{task.payment}</p>
                  <p className="text-sm text-gray-500 mt-2">Location: {task.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No tasks available</div>
          )}
        </div>

        {/* Task Details Popup */}
        {selectedTask && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClosePopup} //close popup on background click
          >
            <div
              className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClosePopup}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedTask?.taskTitle}</h3>
              <p className="text-gray-600 mb-4">{selectedTask?.jobDescription}</p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-bold">💰 Payment:</span> ₦{selectedTask.payment}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">👥 Taskers Needed:</span> {selectedTask.taskersNeeded}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">📍 Location:</span> {selectedTask.location}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">⏳ Duration:</span> {selectedTask.duration}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">📁 Category:</span> {selectedTask.category}
                </p>
              </div>
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gray-100 text-purple-500 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
                >
                  Submit Application
                </button>
              </form>
              {selectedTask.bidAvailable && (
                <button
                  onClick={() =>
                    router.push(
                      `/place-bid?taskId=${selectedTask.id}&taskTitle=${selectedTask.taskTitle}&wageRange=${selectedTask.payment}&duration=${selectedTask.duration}`
                    )
                  }
                  className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition w-full"
                >
                  Place a Bid
                </button>
              )}
            </div>
          </div>
        )}
        </div>
    </>
  );
};

export default TasksPage;