import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 sm:top-[10%] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center sm:p-2">
      <div className="bg-muted rounded-lg p-3 w-full sm:max-w-2xl overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}