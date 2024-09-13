"use client"; 
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

import { v4 as uuidv4 } from 'uuid';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const { user } = useUser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0] as any);
    }
  };

  const handleUpload = async () => {
    console.log('called in handleUpload');
    console.log(user);
    if (file && user) {
      const newJobId = uuidv4();
      setJobId(newJobId); // Save the generated Job ID in the state

      console.log(process.env.NEXT_PUBLIC_AWS_API_URL);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/upload-csv`, {
          method: 'POST',
          body: file,
          headers: {
            'X-Job-Id': newJobId as string,
            'X-User-Id': user.id,
            'Content-Type': 'text/csv',  // Set the correct content type
          },
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        setUploadStatus(`Upload successful: ${newJobId}`);
      } catch (error) {
        setUploadStatus('Upload failed');
      }
    }
  };

  return (
    <div className="mt-6">
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleUpload} className="btn-primary mt-2">
        Upload CSV
      </button>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
};

export { FileUpload };
