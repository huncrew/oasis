"use client"; 
import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0] as any);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload-csv', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setUploadStatus(`Upload successful: ${data.jobId}`);
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
