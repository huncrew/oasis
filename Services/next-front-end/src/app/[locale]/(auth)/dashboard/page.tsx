

"use client"; 
import React, { useState } from 'react';
import { Protect } from '@clerk/nextjs';
import { ProtectFallback } from '@/features/auth/ProtectFallback';
import { MessageState } from '@/features/dashboard/MessageState';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { FileUpload } from '@/features/dashboard/CSVUpload';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import OverviewDashboard from '@/features/dashboard/OverviewDashboard';

const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => (
  <div className="w-64 bg-card p-5 rounded-md">
    <div
      className={`cursor-pointer p-3 text-lg font-semibold rounded-md ${
        activeTab === 'Overview'
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
      onClick={() => setActiveTab('Overview')}
    >
      Overview
    </div>
    <div
      className={`cursor-pointer p-3 text-lg font-semibold rounded-md mt-3 ${
        activeTab === 'Jobs'
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
      onClick={() => setActiveTab('Jobs')}
    >
      Jobs
    </div>
  </div>
);


const JobsTab = () => {
  const [jobs, setJobs] = useState([]);  // State to hold job data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const { user } = useUser();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/jobs`, {
          headers: {
            'X-User-Id': user?.id ?? '',
          },
        });

        console.log(response); // Log the full response

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();

        console.log('DATA JOBS /n', jobs)
        setJobs(data); // Update jobs state with fetched data
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after data fetch or error
      }
    };

    fetchJobs(); // Fetch jobs when the component mounts
  }, []); // Only run once on mount

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-card p-5 rounded-md">
      <h2 className="text-xl font-semibold text-primary">Your Jobs</h2>
      <ul className="mt-4 space-y-3">
        {jobs.map((job: any) => (
          <li key={job.jobId} className="border border-border rounded-md p-4 bg-muted hover:bg-muted-foreground">
            <div className="flex justify-between">
              <p className="text-lg font-medium text-foreground">Job ID: {job.jobId}</p>
              <p className={`text-sm font-semibold ${job.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {job.status}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Created At: {new Date(job.createdAt).toLocaleString()}</p>
            {/* Add result display here */}
            {job.result && (
              <div className="mt-3 bg-gray-100 p-3 rounded-md">
                <h3 className="text-md font-semibold text-primary-foreground">Result:</h3>
                <p className="text-sm text-foreground">{job.result}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};




const DashboardIndexPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [latestJob, setLatestJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchLatestJob = async () => {
      if (activeTab === 'Overview' && user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/latest-job`, {
            headers: {
              'X-User-Id': user.id,
            },
          });

          console.log(response)
  
          if (!response.ok) {

            console.log(response)
            throw new Error('Failed to fetch latest job');
          }
  
          const data = await response.json();
          setLatestJob(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchLatestJob();
  }, [activeTab, user]);
  
  return (
    <>
      <TitleBar title="Dashboard" />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-full p-4">
          {activeTab === 'Overview' && (
            <>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : latestJob ? (
                <OverviewDashboard latestJob={latestJob} />
              ) : (
                <MessageState
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M0 0h24v24H0z" stroke="none" />
                      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                    </svg>
                  }
                  title="Your Dashboard"
                  description="Upload your CSV data"
                  button={<FileUpload />}
                />
              )}
            </>
          )}
          {activeTab === 'Jobs' && <JobsTab />}
        </div>
      </div>
    </>
  ); 
}

export default DashboardIndexPage;