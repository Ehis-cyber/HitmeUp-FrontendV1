'use client'
import React, { useState } from 'react';
import JobRow from './JobRow';
import SideBox from './Sidebox';

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
  };

  return (
    <div className='bg-slate-100 py-10 m-10 rounded-xl'>
      <div className="container">
        <h2 className='font-bold mb-4'>Recommended Task</h2>

        <div className='grid grid-cols-1 md:grid-cols-[1fr,3fr] gap-4'>
          <div className='flex flex-col gap-4'>
            <SideBox/>
          </div>
          <div className='flex flex-col gap-4'>
          <JobRow onJobClick={handleJobClick} />

          </div>
        </div>
      </div>
    </div>
  );
}
