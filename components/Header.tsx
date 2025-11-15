
import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  pageTitle: string;
  onMenuClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, pageTitle, onMenuClick, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
       <button onClick={onMenuClick} className="text-gray-500 focus:outline-none md:hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </button>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{pageTitle}</h2>
      <div className="flex items-center">
        <div className="flex flex-col items-end mr-4">
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user.campus} Campus</span>
        </div>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
            <div className="w-9 h-9 overflow-hidden rounded-full border-2 border-primary-500">
              <img src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt="User Avatar" className="object-cover w-full h-full" />
            </div>
          </button>
          
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
              onMouseLeave={() => setDropdownOpen(false)}
             >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onLogout();
                }}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;