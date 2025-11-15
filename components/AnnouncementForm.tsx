import React, { useState } from 'react';
import { User, Campus } from '../types';
import { CAMPUSES } from '../constants';

interface AnnouncementFormProps {
  user: User;
  onSave: (data: { title: string; content: string; campus: Campus | 'All'; isReminder: boolean }) => void;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ user, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [campus, setCampus] = useState<Campus | 'All'>(user.campus);
  const [isReminder, setIsReminder] = useState(false);
  
  const allCampusOptions: (Campus | 'All')[] = ['All', ...CAMPUSES];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }
    onSave({ title, content, campus, isReminder });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
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
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
        <textarea 
          name="content" 
          id="content" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required 
          rows={5}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="campus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Campus</label>
        <select 
          name="campus" 
          id="campus" 
          value={campus}
          onChange={(e) => setCampus(e.target.value as Campus | 'All')} 
          required 
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          {allCampusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
            <input 
                id="isReminder" 
                name="isReminder" 
                type="checkbox" 
                checked={isReminder}
                onChange={(e) => setIsReminder(e.target.checked)}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor="isReminder" className="font-medium text-gray-700 dark:text-gray-300">Post as Priority Reminder</label>
            <p className="text-gray-500 dark:text-gray-400">If checked, this will immediately send a reminder notification to all Teachers and Accountants.</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Post Announcement
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;