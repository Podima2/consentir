"use client";

import React from "react";
import { X } from "lucide-react";

interface PaymentDialogProps {
  isOpen: boolean;
  price: string;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  price,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment Required</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <p className="mb-4">
          To access this content, a payment of {price} is required.
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog; 