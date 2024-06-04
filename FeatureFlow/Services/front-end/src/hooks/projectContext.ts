import { useState, useEffect } from 'react';

export const useProjectContext = (userId: string, selectedProject: any) => {
  interface Step {
    id: string;
    title: string;
    objective: string;
    exampleCode: string;
    generatedCode: string;
  }

  const [projectContext, setProjectContext] = useState('');
  const [techContext, setTechContext] = useState('');
  const [featureObjective, setFeatureObjective] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedProject) return;

    const fetchData = async () => {
      console.log('in fetch Data');
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/context/${userId}/${selectedProject}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': 'Bearer ' + yourAuthToken, // If you need authorization
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('consoling data', data);
        setProjectContext(data.projectContext || '');
        setTechContext(data.techContext || '');
        setFeatureObjective(data.featureObjective || '');
        setEventDetails(data.eventDetails || '');
        setSteps(data.steps || []);
      } catch (e: any) {
        console.error('Error fetching project context:', e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedProject]);

  return {
    projectContext,
    setProjectContext,
    techContext,
    setTechContext,
    featureObjective,
    setFeatureObjective,
    eventDetails,
    setEventDetails,
    steps,
    setSteps,
    isLoading,
    error,
  };
};

export default useProjectContext;
