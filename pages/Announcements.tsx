import React, { useState, useEffect, useCallback } from 'react';
import { Announcement, User, Campus } from '../types';
import { getAnnouncements, addAnnouncement } from '../services/mockApiService';
import Modal from '../components/Modal';
import AnnouncementForm from '../components/AnnouncementForm';


interface AnnouncementsProps {
  user: User;
}

const Announcements: React.FC<AnnouncementsProps> = ({ user }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const data = await getAnnouncements(user.campus, user.role);
    setAnnouncements(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSaveAnnouncement = async (data: { title: string; content: string; campus: Campus | 'All'; isReminder: boolean }) => {
      await addAnnouncement(data, user);
      setIsFormModalOpen(false);
      fetchAnnouncements();
  };


  if (loading) {
    return <div className="text-center p-10">Loading announcements...</div>;
  }

  return (
    <div>
        <div className="flex justify-end mb-4">
            {user.role === 'Admin' && (
                <button
                    onClick={() => setIsFormModalOpen(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
                >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Announcement
                </button>
            )}
        </div>
        <div className="space-y-6">
        {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{announcement.title}</h3>
                <div className='flex items-center space-x-4'>
                    {announcement.campus !== 'All' && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">{announcement.campus}</span>}
                    <p className="text-sm text-gray-500 dark:text-gray-400">{announcement.date}</p>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3 whitespace-pre-wrap">{announcement.content}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold italic">- {announcement.author}</p>
            </div>
        ))}
        </div>
        <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Create New Announcement">
            <AnnouncementForm
                user={user}
                onSave={handleSaveAnnouncement}
                onCancel={() => setIsFormModalOpen(false)}
            />
        </Modal>
    </div>
  );
};

export default Announcements;