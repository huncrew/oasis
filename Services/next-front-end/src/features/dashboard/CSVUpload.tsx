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
    if (file && user) {
      const newJobId = uuidv4();
      setJobId(newJobId);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/upload-csv`, {
          method: 'POST',
          body: file,
          headers: {
            'X-Job-Id': newJobId as string,
            'X-User-Id': user.id,
            'Content-Type': 'text/csv',
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
    <div className="bg-card p-5 rounded-md">
      <h2 className="text-xl font-semibold text-primary">Upload Your CSV Data</h2>
      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          className="block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/80"
        />
        <button
          onClick={handleUpload}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/80"
        >
          Upload CSV
        </button>
        {uploadStatus && <p className="mt-4 text-sm text-muted-foreground">{uploadStatus}</p>}
      </div>
    </div>
  );
};

export { FileUpload };
