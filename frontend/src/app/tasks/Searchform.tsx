import React, { useState } from "react";

interface SearchFormProps {
  onFilterChange: (filters: {
    keyword: string;
    location: string;
    jobType: string;
    experience: string;
    employmentType: string[];
    duration: string[];
    salaryRange: [number, number];
  }) => void;
  onSearch: () => void; // Add onSearch prop
  onKeywordChange: (keyword: string) => void;
  onJobTypeChange: (jobType: string) => void;
  onExperienceChange: (experience: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onFilterChange, onSearch, onKeywordChange,
  onJobTypeChange,
  onExperienceChange, }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
    experience: "",
    employmentType: [] as string[],
    duration: [] as string[],
    salaryRange: [0, 200000] as [number, number],
  });

  const handleInputChange = (key: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      keyword: "",
      location: "",
      jobType: "",
      experience: "",
      employmentType: [] as string[],
      duration: [] as string[],
      salaryRange: [0, 200000] as [number, number],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters); // Clear filters in the parent component
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters); // Pass the filters to the parent component
    onSearch();
  };

  return (
    <div className="text-center bg-gradient-to-r from-blue-50 to-purple-100 py-16">
      <div className="w-full max-w-screen-xl mx-auto px-5">
        <h1 className="text-3xl font-extrabold lg:text-5xl text-gray-800">Find Help Fast!</h1>
        <p className="mt-3 text-lg text-gray-600 lg:text-xl">
          Get Tasks Done, Fast. Anywhere, Anytime.
        </p>

        <div className="max-w-screen-lg mx-auto mt-8 shadow-lg bg-white rounded-xl p-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col gap-6 lg:gap-4 lg:flex-row">
              {/* Keyword Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  name="keyword"
                  placeholder="Job Keyword"
                  value={filters.keyword}
                  onChange={(e) => {
                  handleInputChange("keyword", e.target.value);
                  onKeywordChange(e.target.value); // Call the handler
  }}
                  className="w-full px-4 py-4 pl-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Location Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-4 py-4 pl-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Job Type Dropdown */}
              <div className="flex-1">
                <select
                  id="jobType"
                  name="jobType"
                  value={filters.jobType}
                   onChange={(e) => {
                    handleInputChange("jobType", e.target.value);
                    onJobTypeChange(e.target.value); // Call the handler
                  }}
                  className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                >
                  <option value="">Job Type</option>
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              {/* Experience Dropdown */}
              <div className="flex-1">
                <select
                  id="experience"
                  name="experience"
                  value={filters.experience}
                 onChange={(e) => {
                    handleInputChange("experience", e.target.value);
                    onExperienceChange(e.target.value); // Call the handler
                  }}
                  className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                >
                  <option value="">Experience</option>
                  <option value="novice">Novice</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Mid-level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                type="submit"
                 onClick={handleSearch}
                className="w-full md:w-auto px-8 py-4 text-sm font-bold text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full md:w-auto px-8 py-4 text-sm font-bold text-purple-500 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;