import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';

interface ReminderFormProps {
  reminder: Reminder | null;
  onSave: (reminderData: Omit<Reminder, 'id' | 'isCompleted' | 'isNotified' | 'userId'>) => void;
  onCancel: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ reminder, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      const dueDate = new Date(reminder.dueDateTime);
      setDate(dueDate.toISOString().split('T')[0]);
      setTime(dueDate.toTimeString().slice(0, 5));
    } else {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30); // Default to 30 mins from now
        setDate(now.toISOString().split('T')[0]);
        setTime(now.toTimeString().slice(0, 5));
    }
  }, [reminder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
        alert("Please fill out all fields.");
        return;
    }
    const dueDateTime = new Date(`${date}T${time}`).toISOString();
    onSave({ title, dueDateTime });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reminder Title</label>
        <input 
          type="text" 
          name="title" 
          id="title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input 
            type="date" 
            name="date" 
            id="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required 
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
            />
        </div>
        <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
            <input 
            type="time" 
            name="time" 
            id="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required 
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
            />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          {reminder ? 'Update Reminder' : 'Set Reminder'}
        </button>
      </div>
    </form>
  );
};

export default ReminderForm;
