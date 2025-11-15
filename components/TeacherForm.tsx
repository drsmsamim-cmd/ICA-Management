import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { CAMPUSES } from '../constants';

interface TeacherFormProps {
  teacher: Teacher | null;
  onSave: (teacherData: Omit<Teacher, 'id' | 'avatarUrl'> | Teacher) => void;
  onCancel: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    campus: CAMPUSES[0],
    salary: 0,
    joiningDate: new Date().toISOString().split('T')[0],
    qualification: '',
    address: ''
  });

  useEffect(() => {
    if (teacher) {
        const { id, avatarUrl, ...dataToEdit } = teacher;
        setFormData(dataToEdit);
    }
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacher) {
      onSave({ ...formData, id: teacher.id, avatarUrl: teacher.avatarUrl });
    } else {
      onSave(formData);
    }
  };
  
  const renderInput = (label: string, name: keyof typeof formData, type = 'text', required = true) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input 
        type={type} 
        name={name} 
        id={name} 
        value={String(formData[name] ?? '')} 
        onChange={handleChange} 
        required={required} 
        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
      />
    </div>
  );
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('Full Name', 'name')}
        {renderInput('Email', 'email', 'email')}
        {renderInput('Phone', 'phone', 'tel')}
        {renderInput('Subject', 'subject')}
        {renderInput('Qualification', 'qualification')}
        {renderInput('Joining Date', 'joiningDate', 'date')}
        {renderInput('Salary', 'salary', 'number')}
         <div>
          <label htmlFor="campus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Campus</label>
          <select name="campus" id="campus" value={formData.campus} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              {CAMPUSES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
        <textarea name="address" id="address" value={formData.address} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          {teacher ? 'Update Teacher' : 'Add Teacher'}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
