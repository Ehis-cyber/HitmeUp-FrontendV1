'use client';
import React, { useState } from 'react';
import JobRow from './JobRow';

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Recommended Tasks</h2>
      <JobRow onJobClick={(job) => console.log(job)} />
    </div>
  );
}