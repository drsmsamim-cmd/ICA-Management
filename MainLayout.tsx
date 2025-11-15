import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import SyllabusPage from './pages/Syllabus';
import Announcements from './pages/Announcements';
import Accounts from './pages/Accounts';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';
import { Page, User } from './types';
import { NAV_ITEMS } from './constants';
import { getRemindersForNotification, updateReminder } from './services/mockApiService';


interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, onUserUpdate }) => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Reminder notification logic
  useEffect(() => {
    const checkReminders = async () => {
        const remindersForUser = await getRemindersForNotification(user);
        const now = new Date();
        
        for (const reminder of remindersForUser) {
            const dueDate = new Date(reminder.dueDateTime);
            if (dueDate <= now && !reminder.isCompleted && !reminder.isNotified) {
                const alertMessage = user.id === reminder.userId
                    ? `Reminder: ${reminder.title}`
                    : `[Admin Announcement]: ${reminder.title}`;
                
                alert(alertMessage);
                
                // Mark as notified to prevent repeated alerts
                await updateReminder({ ...reminder, isNotified: true });
            }
        }
    };
    
    // Check immediately on load and then every 30 seconds
    checkReminders();
    const intervalId = setInterval(checkReminders, 30000); 

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [user]);


  const CurrentPageComponent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard user={user} />;
      case 'Students':
        return <Students user={user} />;
      case 'Teachers':
        return <Teachers user={user} />;
      case 'Syllabus':
        return <SyllabusPage user={user} />;
      case 'Announcements':
        return <Announcements user={user} />;
       case 'Accounts':
        return <Accounts user={user} />;
      case 'Reminders':
        return <Reminders user={user} />;
      case 'Settings':
        return <Settings user={user} onUserUpdate={onUserUpdate} />;
      default:
        return <Dashboard user={user}/>;
    }
  };
  
  const pageTitle = NAV_ITEMS.find(item => item.page === currentPage)?.label || 'Dashboard';

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [currentPage]);


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        user={user}
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user}
          pageTitle={pageTitle} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          <CurrentPageComponent />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;