
import React, { useState } from 'react';
import Spinner from './Spinner';
import { CreditCardIcon, ShieldCheckIcon } from './Icons';
// Removed: import * as apiService from '../services/apiService'; 

interface PaymentViewProps {
  cost: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ cost, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      // Simulate random success/failure or make it always successful for easier testing
      // const paymentSuccessful = Math.random() > 0.1; // 90% success
      const paymentSuccessful = true; 

      if (paymentSuccessful) {
        onSuccess();
      } else {
        onError("Simulated payment failure. Please try again or contact support.");
      }
      setIsProcessing(false);
    }, 1500); // Simulate network delay
  };

  return (
    <div className="p-1">
      <h2 className="text-2xl font-semibold text-textPrimary mb-6 text-center">Complete Your Payment</h2>
      
      <div className="bg-primary-dark text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg">Total Amount Due:</span>
          <span className="text-3xl font-bold flex items-center">
            <span className="mr-1">RS.</span>{cost.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-textSecondary text-sm">
          This is a simulated payment gateway. No real transaction will occur.
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full flex items-center justify-center bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Confirm payment of Rupees ${cost.toFixed(2)}`}
      >
        {isProcessing ? (
          <>
            <Spinner size="sm" color="text-white" />
            <span className="ml-2">Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCardIcon className="w-5 h-5 mr-2" />
            Confirm Payment of RS.{cost.toFixed(2)}
          </>
        )}
      </button>
      
      <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
        <ShieldCheckIcon className="w-4 h-4 mr-1 text-green-500" />
        <span>Secure Simulated Payment</span>
      </div>
    </div>
  );
};

export default PaymentView;