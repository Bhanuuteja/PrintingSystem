import React, { useState, useCallback } from 'react';
import { PrintJob } from '../types';
import { PRICE_PER_PAGE, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';
import { getPdfPageCount } from '../services/pdfUtils';
import { UploadCloudIcon, AlertTriangleIcon } from './Icons';
import Spinner from './Spinner';


interface FileUploadProps {
  onFileProcessed: (jobDetails: { file: File, fileName: string, pageCount: number }) => void;
  onError: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onError, setIsLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setLocalError(null);
    if (file.type !== 'application/pdf') {
      setLocalError('Invalid file type. Only PDF files are accepted.');
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLocalError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const pageCount = await getPdfPageCount(file);
      onFileProcessed({ // Pass basic details, App.tsx will add defaults for other options
        file,
        fileName: file.name,
        pageCount,
      });
    } catch (err) {
      console.error("Error processing PDF:", err);
      let message = 'Could not process PDF file. Ensure it is a valid PDF.';
      if (err instanceof Error) {
          message = err.message;
      }
      onError(message);
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  }, [onFileProcessed, onError, setIsLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  };
  
  return (
    <div className="w-full p-2">
      <h2 className="text-2xl font-semibold text-textPrimary mb-6 text-center">Upload Your Document</h2>
      
      {localError && (
        <div className="mb-4 p-3 bg-red-100 text-error border border-red-300 rounded-lg flex items-center">
          <AlertTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    ${dragOver ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          aria-label="File uploader"
        />
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <UploadCloudIcon className={`w-12 h-12 mb-3 ${dragOver ? 'text-primary' : 'text-gray-400'}`} />
          <p className={`mb-2 text-sm ${dragOver ? 'text-primary' : 'text-textSecondary'}`}>
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF only (MAX. {MAX_FILE_SIZE_MB}MB)</p>
        </label>
      </div>

      {selectedFile && !localError && (
        <div className="mt-6 text-center">
          <p className="text-md text-textSecondary">Selected file: <span className="font-semibold text-textPrimary">{selectedFile.name}</span></p>
          <div className="mt-2"><Spinner size="sm"/> <span className="ml-2">Processing...</span></div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Your document will be processed to calculate the number of pages for printing.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;