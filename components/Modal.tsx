import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '3xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '3xl': 'max-w-3xl',
  };

  const modalWidthClass = sizeClasses[size];


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 print:hidden" onClick={onClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${modalWidthClass} mx-4 print:shadow-none print:rounded-none print:border-0 print:w-full print:max-w-full print:m-0`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 print:hidden">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 print:p-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;