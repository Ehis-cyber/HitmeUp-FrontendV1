import { useEffect, useState } from 'react';
import JobCard from './JobCard';

export default function JobRow({ onJobClick }: { onJobClick: (job: any) => void }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Mock data to replace Firebase
        const mockJobs = [
          {
            id: '1',
            title: 'Check Product Price',
            description: 'check the price of toothbrush at Spar,Lugbe.',
            skills: ['React', 'JavaScript', 'CSS'],
            timestamp: Date.now(), // Add a valid timestamp
          },
          {
            id: '2',
            title: 'Backend Developer',
            description: 'Develop and maintain server-side logic.',
            skills: ['Node.js', 'Express', 'MongoDB'],
            timestamp: Date.now() - 86400000, // 1 day ago
          },
          {
            id: '3',
            title: 'Errand Runner',
            description: 'Pick up groceries and run errands.',
            skills: ['Driving', 'Time Management'],
            timestamp: Date.now() - 172800000, // 2 days ago
          },
        ];

        // Simulate a delay to mimic an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setJobs(mockJobs);
      } catch (error) {
        setError('Error fetching jobs: ' + (error instanceof Error ? error.message : 'Unknown error'));
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {jobs.length === 0 ? (
        <div className="text-gray-500">No jobs found.</div>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={{ ...job, skills: Array.isArray(job.skills) ? job.skills : [] }}
            onJobClick={onJobClick}
          />
        ))
      )}
    </div>
  );
}