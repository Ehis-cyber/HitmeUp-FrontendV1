//tasks searchform
import React from 'react';

const SearchForm = () => {
  return (
    <div className="text-center bg-gradient-to-r from-blue-50 to-purple-100 py-16">
      <div className="w-full max-w-screen-xl mx-auto px-5">
        <h1 className="text-3xl font-extrabold lg:text-5xl text-gray-800">Your task, One Search Away</h1>
        <p className="mt-3 text-lg text-gray-600 lg:text-xl">Explore opportunities that match your time and location</p>

        <div className="max-w-screen-lg mx-auto mt-8 shadow-lg bg-white rounded-xl p-6">
          <form method="post">
            <div className="flex flex-col gap-6 lg:gap-4 lg:flex-row">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 21 21"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 16.8C13.3078 16.8 16.8 13.3078 16.8 9C16.8 4.69218 13.3078 1.2 9 1.2C4.69218 1.2 1.2 4.69218 1.2 9C1.2 13.3078 4.69218 16.8 9 16.8ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.0605 14.5917C15.2861 14.3489 15.6657 14.335 15.9085 14.5606L20.7926 19.0996C21.0353 19.3252 21.0492 19.7048 20.8236 19.9475C20.598 20.1903 20.2184 20.2042 19.9756 19.9786L15.0916 15.4396C14.8488 15.2141 14.8349 14.8344 15.0605 14.5917Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="keyword"
                  placeholder="Job Keyword"
                  className="w-full px-4 py-4 pl-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Location Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 28 28"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      d="M14 2.8a8.96 8.96 0 00-8.96 8.96 8.881 8.881 0 002.33 6.026l6.205 7.218a.56.56 0 00.85 0l6.206-7.218a8.881 8.881 0 002.33-6.026A8.96 8.96 0 0014 2.8zm5.78 14.258L14 23.783l-5.78-6.72a7.84 7.84 0 1111.56 0v-.005z"
                      fill="currentColor"
                    />
                    <path
                      d="M14 7.84a3.92 3.92 0 100 7.84 3.92 3.92 0 000-7.84zm0 6.72a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="w-full px-4 py-4 pl-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Task Type Dropdown */}
              <div className="flex-1">
                <label htmlFor="type" className="sr-only">
                  Task Type
                </label>
                <select
                  name="type"
                  id="type"
                  className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                  aria-label="Task Type"
                >
                  <option value="" disabled selected>
                    Task Type
                  </option>
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="time-limited">Time-Limited</option>
                </select>
              </div>

              {/* Experience Dropdown */}
              <div className="flex-1">
                <label htmlFor="experience" className="sr-only">
                  Experience
                </label>
                <select
                  name="experience"
                  id="experience"
                  className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                  aria-label="Experience"
                >
                  <option value="" disabled selected>
                    Experience
                  </option>
                  <option value="No skill">No skill</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Mid-level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 text-sm font-bold text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
