import React, { useState, useEffect, useRef } from 'react';
import { PrintJob } from '../types';
import Spinner from './Spinner';
import { PrinterIcon, AlertTriangleIcon, FileTextIcon } from './Icons'; // Removed TrueRupeeIcon and other specific icons not directly used in this view for this change

interface PrintViewProps {
  job: PrintJob;
  onPrintComplete: () => void;
  onPrintError: (message: string) => void;
}

const PrintView: React.FC<PrintViewProps> = ({ job, onPrintComplete, onPrintError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [printInitiated, setPrintInitiated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(job.file);
    if (iframeRef.current) {
      iframeRef.current.src = objectUrl;
      iframeRef.current.onload = () => {
        setIsLoading(false);
      };
      iframeRef.current.onerror = () => {
        setIsLoading(false);
        onPrintError("Failed to load PDF for printing.");
      }
    }
    return () => URL.revokeObjectURL(objectUrl); // Clean up
  }, [job.file, onPrintError]);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        setPrintInitiated(true);
        iframeRef.current.contentWindow.focus(); 
        iframeRef.current.contentWindow.print();
        setTimeout(() => {
            onPrintComplete(); 
        }, 1000); 
      } catch (err) {
        console.error("Printing error:", err);
        onPrintError("Could not initiate printing. Please check browser console or try again.");
      }
    } else {
      onPrintError("Print frame not ready.");
    }
  };

  const getReadableOption = (optionValue: string) => {
    return optionValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }


  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Spinner />
        <p className="mt-4 text-lg text-textSecondary">Preparing your document for printing...</p>
      </div>
    );
  }

  return (
    <div className="p-1 text-center">
      <h2 className="text-2xl font-semibold text-textPrimary mb-4">Ready to Print</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6 text-left space-y-3">
        <h3 className="text-lg font-medium text-textPrimary border-b pb-2 mb-3">Print Job Summary</h3>
        <div className="flex items-center">
          <FileTextIcon className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
          <p><span className="font-medium text-textSecondary">File:</span> <span className="text-textPrimary truncate" title={job.fileName}>{job.fileName}</span></p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <p><span className="font-medium text-textSecondary">Pages/Copy:</span> {job.pageCount}</p>
            <p><span className="font-medium text-textSecondary">Copies:</span> {job.copies}</p>
            <p><span className="font-medium text-textSecondary">Orientation:</span> {getReadableOption(job.orientation)}</p>
            <p><span className="font-medium text-textSecondary">Color:</span> {getReadableOption(job.colorMode)}</p>
            <p><span className="font-medium text-textSecondary">Sides:</span> {getReadableOption(job.duplexMode)}</p>
        </div>
         <div className="flex items-center pt-2 border-t mt-3">
            {/* Using text "RS." instead of an icon */}
            <p><span className="font-medium text-textSecondary">Total Cost Paid:</span> <span className="font-semibold text-textPrimary"><span className="font-semibold text-textPrimary mr-0.5">RS.</span>{job.cost.toFixed(2)}</span></p>
        </div>
      </div>
      
      <p className="text-textSecondary mb-6">
        Review your settings above. Click the button below to open the print dialog.
      </p>
      
      {!printInitiated ? (
        <button
          onClick={handlePrint}
          className="w-full max-w-xs mx-auto flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          aria-label={`Print document ${job.fileName}`}
        >
          <PrinterIcon className="w-5 h-5 mr-2" />
          Print Document
        </button>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">Print dialog should be open. Please complete printing via your browser.</p>
          <p className="text-sm text-gray-600 mt-2">If the dialog didn't appear, please check your browser's pop-up blocker settings.</p>
        </div>
      )}

      <iframe ref={iframeRef} title="Print Document" style={{ display: 'none' }} aria-hidden="true"></iframe>
      
      <div className="mt-8 text-sm text-gray-500">
        <AlertTriangleIcon className="w-4 h-4 inline mr-1" />
        Ensure your printer is connected and selected in the print dialog.
      </div>
    </div>
  );
};

export default PrintView;