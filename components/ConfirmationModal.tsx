import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmButtonClass = 'bg-roulette-red text-white hover:bg-red-700',
  cancelButtonClass = 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500',
}) => {
  if (!isOpen) return null;

  const baseButtonClasses = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors";

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-zinc-900 rounded-lg shadow-xl p-6 m-4 w-full max-w-md transform transition-all border border-gray-800/50"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h3 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white capitalize">{title}</h3>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</div>
        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            type="button"
            className={`${baseButtonClasses} ${cancelButtonClass} focus:ring-gray-500`}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            type="button"
            className={`${baseButtonClasses} ${confirmButtonClass} focus:ring-red-500`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};