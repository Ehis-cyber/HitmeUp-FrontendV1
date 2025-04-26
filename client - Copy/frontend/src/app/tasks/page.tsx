"use client";
import { Timestamp } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { firestore } from "../firebase/firebaseConfig";
import TopNavbar from "../components/navbar/TopNavbar";
import SearchForm from "./Searchform";

interface Task {
  id: string;
  companyLogo_userimage: string;
  companyName: string;
  createdAt: Timestamp | string;
  title: string;
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

interface SearchFormProps {
  onFilterChange: React.Dispatch<React.SetStateAction<{
    employmentType: string[];
    salaryRange: [number, number];
    experienceLevel: string[];
    location: string[];
    duration: string[];
  }>>;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    employmentType: [] as string[],
    salaryRange: [500, 500000] as [number, number],
    experienceLevel: [] as string[],
    location: [] as string[],
    duration: [] as string[],
  });

  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasksCollection = collection(firestore, "tasks");
      const conditions: any[] = [];

      if (filters.employmentType.length > 0) {
        conditions.push(
          where("employmentType", "in", filters.employmentType.slice(0, 10))
        );
      }
      if (filters.experienceLevel.length > 0) {
        conditions.push(
          where("experienceLevel", "in", filters.experienceLevel.slice(0, 10))
        );
      }
      if (filters.location.length > 0) {
        conditions.push(where("location", "in", filters.location.slice(0, 10)));
      }
      if (filters.duration.length > 0) {
        conditions.push(where("duration", "in", filters.duration.slice(0, 10)));
      }
      if (filters.salaryRange[0] !== 500 || filters.salaryRange[1] !== 500000) {
        conditions.push(where("salaryMin", ">=", filters.salaryRange[0]));
        conditions.push(where("salaryMax", "<=", filters.salaryRange[1]));
      }

      const q = query(tasksCollection, ...conditions);
      const querySnapshot = await getDocs(q);
      const taskData: Task[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...((({ id, ...rest }) => rest)(doc.data() as Task)),
        createdAt: doc.data().createdAt.toDate().toISOString(),
      }));

      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };
  // Removed redundant redefinition of SearchForm
  //const SearchForm: React.FC<SearchFormProps> = ({ onFilterChange }) => {
    // Component implementation
  return (
    <>
      <TopNavbar />

    <SearchForm onFilterChange={setFilters} />
      <div className="w-full max-w-screen-xl mx-auto px-5 py-8 flex flex-col lg:flex-row gap-6">
        {/* Filters Panel */}
        <div className="w-full lg:w-64 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Filters</h3>
          <div className="mb-6">
            <h4 className="font-medium mb-3">Task Type</h4>
            <ul className="space-y-2">
              {["Full Time", "Part Time", "Artisan", "Errands", "Contract","Quick Task"].map(
                (type) => (
                  <li key={type}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.employmentType.includes(type)}
                        onChange={() =>
                          handleFilterChange(
                            "employmentType",
                            filters.employmentType.includes(type)
                              ? filters.employmentType.filter((t) => t !== type)
                              : [...filters.employmentType, type]
                          )
                        }
                        className="w-5 h-5 border-gray-300 rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>{type}</span>
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>
          {/* Location Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Location</h4>
            <ul className="space-y-2">
              {[
                "Bwari",
                "Kubwa",
                "Gwagwalada",
                "City Center",
                "Kuje",
                "Gwarimpa",
                "Kabusa",
                "Wuse",
                "Garki",
              ].map((location) => (
                <li key={location}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={() => {
                        const updatedLocations = filters.location.includes(
                          location
                        )
                          ? filters.location.filter((l) => l !== location)
                          : [...filters.location, location];
                        handleFilterChange("location", updatedLocations);
                      }}
                      className="w-5 h-5 border-gray-300 rounded text-emerald-500 focus:ring-emerald-500"
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
              {[
                "1 hour",
                "7 day",
                "4 week",
                "3 months",
                "6 months",
                "other",
              ].map((duration) => (
                <li key={duration}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.duration.includes(duration)}
                      onChange={() => {
                        const updatedDurations = filters.duration.includes(
                          duration
                        )
                          ? filters.duration.filter((d) => d !== duration)
                          : [...filters.duration, duration];
                        handleFilterChange("duration", updatedDurations);
                      }}
                      className="w-5 h-5 border-gray-300 rounded text-emerald-500 focus:ring-emerald-500"
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
              min={500}
              max={500000}
              value={filters.salaryRange[1]}
              onChange={(e) => {
                handleFilterChange("salaryRange", [
                  filters.salaryRange[0],
                  parseInt(e.target.value),
                ]);
              }}
              className="w-full"
              title="Adjust salary range"
            />
            <div className="flex justify-between">
              <span>N{filters.salaryRange[0]}</span>
              <span>{filters.salaryRange[1]}</span>
            </div>
          </div>
          {/* Experience Level Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Experience Level</h4>
            <ul className="space-y-2">
              {["Entry", "Intermediate", "Senior","No skill"].map((level) => (
                <li key={level}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.experienceLevel.includes(level)}
                      onChange={() =>
                        handleFilterChange(
                          "experienceLevel",
                          filters.experienceLevel.includes(level)
                            ? filters.experienceLevel.filter((l) => l !== level)
                            : [...filters.experienceLevel, level]
                        )
                      }
                      className="w-5 h-5 border-gray-300 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>{level}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
       {/* Tasks List */}
<div className="flex-1">
  {tasks.length > 0 ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col justify-between h-72"
        >
          <h4 className="font-bold text-lg text-gray-800 mb-2">{task.title}</h4>
          <p className="text-gray-600">
            Posted by: <span className="font-medium">{task.companyName}</span>
          </p>
          <p className="text-gray-500 text-sm">
            Posted on: {new Date(typeof task.createdAt === "string" ? task.createdAt : task.createdAt.toDate()).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mt-2">Payment: {task.payment}</p>
          <p className="text-sm text-gray-500 mt-2">Location: {task.location}</p>

          {/* Buttons side by side */}
          <div className="flex mt-4 space-x-4">
                    <button
                      onClick={() => window.location.href = `/apply`}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/place-bid?taskId=${task.id}&taskTitle=${task.title}&wageRange=${task.payment}&duration=${task.duration}`
                        )
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
                    >
                      Place a Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No tasks available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
//} 
export default TasksPage;