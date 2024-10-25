

"use client"; 
import React, { useState } from 'react';
// import { Protect } from '@clerk/nextjs';
// import { ProtectFallback } from '@/features/auth/ProtectFallback';
import { MessageState } from '@/features/dashboard/MessageState';
import { TitleBar } from '@/features/dashboard/TitleBar';
import FileUpload from '@/features/dashboard/CSVUpload';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import OverviewDashboard from '@/features/dashboard/OverviewDashboard';
import { useRouter } from 'next/navigation';
import IntegrationsTab from '@/features/dashboard/IntegrationTab';


// src/features/dashboard/Sidebar.tsx

const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab,
}) => (
  <div className="w-64 bg-card p-4">
    <nav className="space-y-2">
      <button
        onClick={() => setActiveTab('Overview')}
        className={`w-full text-left px-4 py-2 rounded ${
          activeTab === 'Overview' ? 'bg-primary text-white' : 'text-foreground'
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => setActiveTab('Jobs')}
        className={`w-full text-left px-4 py-2 rounded ${
          activeTab === 'Jobs' ? 'bg-primary text-white' : 'text-foreground'
        }`}
      >
        Jobs
      </button>
      <button
        onClick={() => setActiveTab('Integrations')}
        className={`w-full text-left px-4 py-2 rounded ${
          activeTab === 'Integrations' ? 'bg-primary text-white' : 'text-foreground'
        }`}
      >
        Integrations
      </button>
    </nav>
  </div>
);



interface Job {
  jobId: string;
  createdAt: string;
  result: any[]; // Replace `any` with a specific type if possible
  resultsCount: number;
  // Remove 'status' as it's not present in the data
}


const JobsTab: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const router = useRouter();

  console.log(loading)
  console.log(error)

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/jobs`, {
          headers: {
            'X-User-Id': user.id,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();

        console.log('CONSOLING THE DATA', data)

        // Map the data to the Job interface
        const mappedJobs: Job[] = data.map((job: any) => ({
          jobId: job.jobId, // Directly use 'jobId' from data
          createdAt: job.createdAt, // Use the correct case
          result: job.result, // Directly use 'result' array
          resultsCount: job.result ? job.result.length : 0, // Correctly reference 'result'
        }));
        

        setJobs(mappedJobs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const handleViewDetails = (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}`);
  };

  // ... (rest of the component remains the same)

  return (
    <div className="bg-card p-5 rounded-md">
      <h2 className="text-xl font-semibold text-primary">Your Jobs</h2>
      <table className="min-w-full mt-4">
  <thead>
    <tr>
      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Job ID</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Created At</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Feedback Count</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Actions</th>
      {/* Remove or add additional headers if necessary */}
    </tr>
  </thead>
  <tbody>
    {jobs.map((job) => (
      <tr key={job.jobId} className="border-t border-border">
        <td className="px-4 py-2 text-sm text-foreground">{job.jobId}</td>
        <td className="px-4 py-2 text-sm text-foreground">
          {new Date(job.createdAt).toLocaleString()}
        </td>
        <td className="px-4 py-2 text-sm text-foreground">{job.resultsCount}</td>
        <td className="px-4 py-2 text-sm text-foreground">
          <button
            onClick={() => handleViewDetails(job.jobId)}
            className="text-primary hover:underline"
          >
            View Details
          </button>
        </td>
        {/* Remove 'status' and 'result' cells */}
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};


interface TimeFrameSelectorProps {
  timeFrame: string;
  setTimeFrame: React.Dispatch<React.SetStateAction<string>>;
}

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({ timeFrame, setTimeFrame }) => (
  <div className="flex space-x-4 mb-4">
    <button
      className={`px-4 py-2 rounded ${
        timeFrame === '7' ? 'bg-primary text-white' : 'bg-muted text-foreground'
      }`}
      onClick={() => setTimeFrame('7')}
    >
      Last 7 Days
    </button>
    <button
      className={`px-4 py-2 rounded ${
        timeFrame === '30' ? 'bg-primary text-white' : 'bg-muted text-foreground'
      }`}
      onClick={() => setTimeFrame('30')}
    >
      Last 30 Days
    </button>
    <button
      className={`px-4 py-2 rounded ${
        timeFrame === 'all' ? 'bg-primary text-white' : 'bg-muted text-foreground'
      }`}
      onClick={() => setTimeFrame('all')}
    >
      All Time
    </button>
  </div>
);



interface AnalysisResult {
  feedbackText: string;
  sentiment: string;
  themes: string[];
  recommendations?: string[];
}

const DashboardIndexPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  // const [latestJob, setLatestJob] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [aggregatedResults, setAggregatedResults] = useState<AnalysisResult[] | null>(null);
  const [loadingAggregated, setLoadingAggregated] = useState(true);
  const [aggregationError, setAggregationError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState('30'); // Default to last 30 days


  const { user } = useUser();

  useEffect(() => {
    const fetchAggregatedResults = async () => {
      if (activeTab === 'Overview' && user) {
        try {
          setLoadingAggregated(true);
  
          // Calculate date range
          let startDate = null;
          const endDate = new Date().toISOString();
          if (timeFrame !== 'all') {
            const days = parseInt(timeFrame, 10);
            const date = new Date();
            date.setDate(date.getDate() - days);
            startDate = date.toISOString();
          }
  
          // Build query parameters
          const queryParams = new URLSearchParams();
          if (startDate) queryParams.append('startDate', startDate);
          queryParams.append('endDate', endDate);
  
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_AWS_API_URL}/aggregated-results?${queryParams.toString()}`,
            {
              headers: {
                'X-User-Id': user.id,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error('Failed to fetch aggregated results');
          }
  
          const data = await response.json();
          setAggregatedResults(data.Results);
        } catch (err: any) {
          setAggregationError(err.message);
        } finally {
          setLoadingAggregated(false);
        }
      }
    };
  
    fetchAggregatedResults();
  }, [activeTab, user, timeFrame]);
  
  
  return (
    <>
      <TitleBar title="Dashboard" />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-full p-4">
        {activeTab === 'Overview' && (
    <>
              {/* Flex container for TimeFrameSelector and FileUpload */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                {/* Left Side: TimeFrameSelector */}
                <TimeFrameSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
                
                {/* Right Side: FileUpload */}
                <FileUpload />
              </div>

              {/* Aggregated Data Display */}
        {loadingAggregated ? (
          <p>Loading aggregated data...</p>
        ) : aggregationError ? (
          <p>Error: {aggregationError}</p>
        ) : aggregatedResults && aggregatedResults.length > 0 ? (
          <OverviewDashboard results={aggregatedResults} />
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
          {activeTab === 'Integrations' && <IntegrationsTab />}
        </div>
      </div>
    </>
  ); 
}

export default DashboardIndexPage;