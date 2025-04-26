import React from 'react';
import { FaHeart } from 'react-icons/fa';

interface JobCardProps {
  job: {
    companyLogo_userimage?: string;
    companyName: string;
    createdAt: number; // Updated to use standard timestamp
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
  };
  onJobClick: (job: any) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onJobClick }) => {
  const formatDate = (timestamp: number) => {
    const jobDate = new Date(timestamp); // Convert timestamp to Date object
    const today = new Date();

    if (
      jobDate.getDate() === today.getDate() &&
      jobDate.getMonth() === today.getMonth() &&
      jobDate.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }

    return jobDate.toLocaleDateString(); // Format the date as a readable string
  };

  const skillColors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-red-200'];

  const handleApply = (jobId: string) => {
    // Mock functionality for applying to a job
    console.log(`Applied to job with ID: ${jobId}`);
    alert('You have successfully applied for this job.');
  };

  return (
    <div
      className="bg-white px-4 py-6 rounded-lg shadow-sm flex gap-4 items-center mb-6 cursor-pointer"
      onClick={() => onJobClick(job)}
    >
      <div className="flex-shrink-0">
        <img
          className="w-12 h-12 object-contain"
          src={job.companyLogo_userimage || '/default-logo.png'}
          alt={`${job.companyName} logo`}
        />
      </div>
      <div className="flex-grow">
        <div className="text-xs text-gray-500 italic">{formatDate(job.createdAt)}</div>
        <div className="text-lg font-semibold">{job.companyName}</div>
        <div className="text-sm text-gray-600">{job.title}</div>
        <div className="text-sm text-gray-500">{job.location}</div>

        <div className="flex items-center gap-2 mt-2">
          <span className="bg-green-200 text-green-600 text-xs px-2 py-1 rounded-full">{`Taskers Needed: ${job.taskersNeeded}`}</span>
          <span className="bg-blue-200 text-blue-600 text-xs px-2 py-1 rounded-full">{`Gig Length: ${job.duration}`}</span>
        </div>

        <div className="mt-4">
          {Array.isArray(job.skills) && job.skills.length > 0 ? (
            job.skills.map((skill, index) => (
              <span
                key={index}
                className={`${skillColors[index % skillColors.length]} text-gray-600 text-xs px-2 py-1 rounded-full mr-2`}
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No skills listed</span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between items-end text-sm text-black-500 gap-1">
        <FaHeart className={`text-xl mb-2 ${job.favorite ? 'text-red-600' : 'text-gray-600'}`} />
        <div className="font-bold">{job.payment}</div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the `onJobClick` event
            handleApply(job.title); // Use job title or ID for mock apply functionality
          }}
          className="bg-red-600 text-white px-3 py-1 rounded-md mt-2"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;