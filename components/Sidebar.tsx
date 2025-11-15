
import React from 'react';
import { Page, NavItem, User } from '../types';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
  };
  
  const accessibleNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">ICA Management</h1>
        </div>
        <nav className="mt-6">
          {accessibleNavItems.map((item) => (
            <NavItemLink
              key={item.page}
              item={item}
              isActive={currentPage === item.page}
              onClick={() => handleNavClick(item.page)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

interface NavItemLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

const NavItemLink: React.FC<NavItemLinkProps> = ({ item, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center px-6 py-3 mx-4 my-1 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <item.icon className="h-6 w-6" />
    <span className="ml-4 font-medium">{item.label}</span>
  </a>
);

export default Sidebar;