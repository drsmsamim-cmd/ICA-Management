import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Reminder, User } from '../types';
import { getReminders, addReminder, updateReminder, deleteReminder } from '../services/mockApiService';
import Modal from '../components/Modal';
import ReminderForm from '../components/ReminderForm';
import { RemindersIcon } from '../constants';

interface RemindersProps {
  user: User;
}

const Reminders: React.FC<RemindersProps> = ({ user }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    const data = await getReminders(user.id);
    setReminders(data);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const { upcomingReminders, completedReminders } = useMemo(() => {
    const upcoming = reminders
      .filter(r => !r.isCompleted)
      .sort((a, b) => new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime());
    const completed = reminders
      .filter(r => r.isCompleted)
      .sort((a, b) => new Date(b.dueDateTime).getTime() - new Date(a.dueDateTime).getTime());
    return { upcomingReminders: upcoming, completedReminders: completed };
  }, [reminders]);


  const handleAddClick = () => {
    setSelectedReminder(null);
    setIsModalOpen(true);
  };
  
  const handleToggleComplete = async (reminder: Reminder) => {
    await updateReminder({ ...reminder, isCompleted: !reminder.isCompleted });
    fetchReminders();
  };

  const handleDeleteClick = async (reminderId: string) => {
    if(window.confirm('Are you sure you want to delete this reminder?')) {
        await deleteReminder(reminderId);
        fetchReminders();
    }
  };

  const handleSaveReminder = async (reminderData: Omit<Reminder, 'id' | 'isCompleted' | 'isNotified' | 'userId'>) => {
    if (selectedReminder) {
      // This is an edit, but our add/update logic is simplified.
      // A more robust implementation would distinguish edit from new.
      const updatedData = { ...selectedReminder, ...reminderData };
      await updateReminder(updatedData);
    } else {
      await addReminder({ ...reminderData, userId: user.id });
    }
    fetchReminders();
    setIsModalOpen(false);
    setSelectedReminder(null);
  };
  
  const closeModal = () => {
      setIsModalOpen(false);
      setSelectedReminder(null);
  }

  const ReminderItem: React.FC<{ reminder: Reminder }> = ({ reminder }) => {
    const isPastDue = !reminder.isCompleted && new Date(reminder.dueDateTime) < new Date();
    return (
        <div className={`p-4 rounded-lg flex items-center justify-between transition-colors duration-200 ${reminder.isCompleted ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 shadow-sm'}`}>
            <div className="flex items-center space-x-4">
                <input 
                    type="checkbox"
                    checked={reminder.isCompleted}
                    onChange={() => handleToggleComplete(reminder)}
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <div>
                    <p className={`font-medium ${reminder.isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                        {reminder.title}
                    </p>
                    <p className={`text-sm ${isPastDue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                       {new Date(reminder.dueDateTime).toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                 <button onClick={() => handleDeleteClick(reminder.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                 </button>
            </div>
        </div>
    );
  };


  if (loading) {
    return <div className="text-center p-10">Loading reminders...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Reminders</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Reminder
        </button>
      </div>

      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Upcoming</h3>
            <div className="space-y-3">
                {upcomingReminders.length > 0 ? (
                    upcomingReminders.map(r => <ReminderItem key={r.id} reminder={r} />)
                ) : (
                    <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>

         <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Completed</h3>
             <div className="space-y-3">
                {completedReminders.length > 0 ? (
                    completedReminders.map(r => <ReminderItem key={r.id} reminder={r} />)
                ) : (
                    <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No completed reminders yet.</p>
                    </div>
                )}
            </div>
        </div>
      </div>


      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedReminder ? 'Edit Reminder' : 'Set a New Reminder'}>
        <ReminderForm
            reminder={selectedReminder}
            onSave={handleSaveReminder}
            onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Reminders;
