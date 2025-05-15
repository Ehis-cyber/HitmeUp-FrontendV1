import React from 'react';

export default function SearchForm() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl p-10 space-y-6">
      <form className="space-y-4 lg:space-y-0 lg:flex lg:gap-3">
        {/* Job Keyword Input */}
        <div className="relative flex-1">
          <input
            type="text"
            name="keyword"
            placeholder="Job Keyword"
            aria-label="Job Keyword"
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 16.8C13.3078 16.8 16.8 13.3078 16.8 9C16.8 4.69218 13.3078 1.2 9 1.2C4.69218 1.2 1.2 4.69218 1.2 9C1.2 13.3078 4.69218 16.8 9 16.8ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0605 14.5917C15.2861 14.3489 15.6657 14.335 15.9085 14.5606L20.7926 19.0996C21.0353 19.3252 21.0492 19.7048 20.8236 19.9475C20.598 20.1903 20.2184 20.2042 19.9756 19.9786L15.0916 15.4396C14.8488 15.2141 14.8349 14.8344 15.0605 14.5917Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>

        {/* Location Input */}
        <div className="relative flex-1">
          <input
            type="text"
            name="location"
            placeholder="Location"
            aria-label="Location"
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path
                d="M14 2.8a8.96 8.96 0 00-8.96 8.96 8.881 8.881 0 002.33 6.026l6.205 7.218a.56.56 0 00.85 0l6.206-7.218a8.881 8.881 0 002.33-6.026A8.96 8.96 0 0014 2.8zm5.78 14.258L14 23.783l-5.78-6.72a7.84 7.84 0 1111.56 0v-.005z"
                fill="currentColor"
              ></path>
              <path
                d="M14 7.84a3.92 3.92 0 100 7.84 3.92 3.92 0 000-7.84zm0 6.72a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          Search
        </button>
      </form>

      {/* Popular Searches */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <p className="text-gray-600">Popular Searches:</p>
        {["Errands","Remote","Onsite","Hybrid"].map((tag, idx) => (
          <a
            key={idx}
            href="#"
            className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200"
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
}
