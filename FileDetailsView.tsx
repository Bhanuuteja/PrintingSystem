import React, { useState, useEffect } from 'react';
import { PrintJob, Orientation, ColorMode, DuplexMode } from '../types';
import { PRICE_PER_PAGE } from '../constants';
import { FileTextIcon, ArrowRightIcon, XIcon } from './Icons'; // Removed TrueRupeeIcon as it's replaced by text

interface FileDetailsViewProps {
  job: PrintJob;
  onConfirm: (updatedJob: PrintJob) => void;
  onCancel: () => void;
}

const FileDetailsView: React.FC<FileDetailsViewProps> = ({ job, onConfirm, onCancel }) => {
  const [copies, setCopies] = useState<number>(job.copies);
  const [orientation, setOrientation] = useState<Orientation>(job.orientation);
  const [colorMode, setColorMode] = useState<ColorMode>(job.colorMode);
  const [duplexMode, setDuplexMode] = useState<DuplexMode>(job.duplexMode);
  const [currentCost, setCurrentCost] = useState<number>(job.cost);

  useEffect(() => {
    setCurrentCost(job.pageCount * PRICE_PER_PAGE * copies);
  }, [copies, job.pageCount]);

  const handleConfirm = () => {
    onConfirm({
      ...job,
      copies,
      orientation,
      colorMode,
      duplexMode,
      cost: currentCost,
    });
  };

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white";
  const labelClass = "block text-sm font-medium text-textSecondary";

  return (
    <div className="p-1">
      <h2 className="text-2xl font-semibold text-textPrimary mb-6 text-center">Confirm Print Job & Specifications</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4 mb-6">
        <div className="flex items-center">
          <FileTextIcon className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-textSecondary">File Name</p>
            <p className="text-md font-medium text-textPrimary truncate" title={job.fileName}>{job.fileName}</p>
          </div>
        </div>
        
        <div>
            <p className="text-sm text-textSecondary">Pages per copy</p>
            <p className="text-md font-medium text-textPrimary">
              {job.pageCount} page{job.pageCount !== 1 ? 's' : ''}
            </p>
        </div>
      </div>

      <div className="space-y-5 mb-6">
        <div>
          <label htmlFor="copies" className={labelClass}>Number of Copies</label>
          <input
            type="number"
            id="copies"
            name="copies"
            value={copies}
            onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            className={inputClass}
            aria-describedby="copies-description"
          />
           <p id="copies-description" className="mt-1 text-xs text-gray-500">How many sets to print.</p>
        </div>

        <div>
          <label htmlFor="orientation" className={labelClass}>Orientation</label>
          <select
            id="orientation"
            name="orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className={inputClass}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div>
          <label htmlFor="colorMode" className={labelClass}>Color Mode</label>
          <select
            id="colorMode"
            name="colorMode"
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
            className={inputClass}
          >
            <option value="black-and-white">Black and White</option>
            <option value="color">Color</option>
          </select>
        </div>

        <div>
          <label htmlFor="duplexMode" className={labelClass}>Print On</label>
          <select
            id="duplexMode"
            name="duplexMode"
            value={duplexMode}
            onChange={(e) => setDuplexMode(e.target.value as DuplexMode)}
            className={inputClass}
          >
            <option value="single-sided">Single-sided</option>
            <option value="double-sided-long-edge">Double-sided (Flip on long edge)</option>
            <option value="double-sided-short-edge">Double-sided (Flip on short edge)</option>
          </select>
        </div>
      </div>
      
      <div className="bg-primary-dark text-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center">
          <span className="text-lg">Total Estimated Cost:</span>
          <span className="text-2xl font-bold flex items-center">
            <span className="mr-1">RS.</span>{currentCost.toFixed(2)}
          </span>
        </div>
      </div>


      <div className="mt-8 space-y-3">
        <button
          onClick={handleConfirm}
          className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          aria-label="Proceed to payment with current specifications"
        >
          Proceed to Payment <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
        <button
          onClick={onCancel}
          className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-textSecondary font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          aria-label="Cancel print job and return to upload"
        >
          <XIcon className="w-5 h-5 mr-2" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default FileDetailsView;