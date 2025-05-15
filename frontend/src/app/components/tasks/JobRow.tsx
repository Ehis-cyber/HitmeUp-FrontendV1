import { useEffect, useState } from 'react';
import JobCard from './JobCard';

export default function JobRow({ onJobClick }: { onJobClick: (job: any) => void }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/tasks/random");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError("Error fetching jobs: " + (error instanceof Error ? error.message : "Unknown error"));
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.length === 0 ? (
        <div className="text-center text-gray-500">No jobs found.</div>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job._id}
            job={{ ...job, skills: Array.isArray(job.skills) ? job.skills : [] }}
            onJobClick={onJobClick}
          />
        ))
      )}
    </div>
  );
}