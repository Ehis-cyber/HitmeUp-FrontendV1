import React from 'react';
import { FaHeart, FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding } from 'react-icons/fa';

interface JobCardProps {
  job: {
    companyLogo_userimage?: string;
    companyName: string;
    createdAt: number;
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
  };
  onJobClick: (job: any) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onJobClick }) => {
  const formatDate = (timestamp: number) => {
    const jobDate = new Date(timestamp);
    const today = new Date();

    if (
      jobDate.getDate() === today.getDate() &&
      jobDate.getMonth() === today.getMonth() &&
      jobDate.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }

    return jobDate.toLocaleDateString();
  };

  return (
    <div
      className="relative bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onJobClick(job)}
    >
      {/* Heart Icon */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className={`text-xl ${
            job.favorite ? 'text-red-500' : 'text-gray-400'
          } hover:text-red-500 focus:outline-none`}
          title={job.favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={job.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FaHeart />
        </button>
      </div>

      {/* Task Image */}
      {job.companyLogo_userimage && (
        <img
          src={job.companyLogo_userimage}
          alt={job.companyName}
          className="w-full h-32 object-cover rounded-md mb-4"
        />
      )}

      {/* Job Title */}
      <h3 className="text-lg font-bold text-gray-800 truncate">{job.taskTitle}</h3>

      {/* Job Description */}
      <p className="text-sm text-gray-600 mt-2">{job.jobDescription}</p>

      {/* Other Job Details */}
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-500 flex items-center">
          <FaBuilding className="mr-2 text-gray-400" />
          <strong>Company:</strong> {job.companyName}
        </p>
        <p className="text-sm text-gray-500 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-sm text-gray-500 flex items-center">
          <FaDollarSign className="mr-2 text-gray-400" />
          <strong>Payment:</strong> ₦{job.payment}
        </p>
      </div>
    </div>
  );

};

export default JobCard;