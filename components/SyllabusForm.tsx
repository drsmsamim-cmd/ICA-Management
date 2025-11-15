import React, { useState, useEffect } from 'react';
import { Syllabus, Teacher } from '../types';
import { CAMPUSES, WEEKS, CLASS_LEVELS } from '../constants';

interface SyllabusFormProps {
  syllabus: Syllabus | null;
  teachers: Teacher[];
  onSave: (syllabusData: Syllabus | Omit<Syllabus, 'id' | 'teacherName'>) => void;
  onCancel: () => void;
}

const SyllabusForm: React.FC<SyllabusFormProps> = ({ syllabus, teachers, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    teacherId: '',
    studentCount: 0,
    description: '',
    campus: CAMPUSES[0],
    week: WEEKS[0],
    classLevel: CLASS_LEVELS[0],
  });

  useEffect(() => {
    if (syllabus) {
      const { id, teacherName, code, ...dataToEdit } = syllabus;
      setFormData(dataToEdit);
    } else {
        // Set default teacher if list is available
        if (teachers.length > 0) {
            setFormData(prev => ({...prev, teacherId: teachers[0].id }));
        }
    }
  }, [syllabus, teachers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `${formData.classLevel.toUpperCase()}-${formData.subject.slice(0, 3).toUpperCase()}-${Date.now() % 1000}`;

    if (syllabus) {
      // teacherName is set on the backend/service layer
      onSave({ ...formData, id: syllabus.id, teacherName: '', code }); 
    } else {
      onSave({ ...formData, code });
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
  
  const renderSelect = (label: string, name: keyof typeof formData, options: {value: string, label: string}[], required = true) => (
      <div>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          <select name={name} id={name} value={String(formData[name] ?? '')} onChange={handleChange} required={required} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
      </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('Title', 'title')}
        {renderInput('Subject', 'subject')}
        {renderSelect('Class', 'classLevel', CLASS_LEVELS.map(c => ({ value: c, label: `Class ${c}` })))}
        {renderInput('Student Count', 'studentCount', 'number')}
        {renderSelect('Week', 'week', WEEKS.map(w => ({ value: w, label: w })))}
        {renderSelect('Campus', 'campus', CAMPUSES.map(c => ({ value: c, label: c })))}
        {renderSelect('Teacher', 'teacherId', teachers.map(t => ({ value: t.id, label: t.name })))}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          {syllabus ? 'Update Plan' : 'Save Plan'}
        </button>
      </div>
    </form>
  );
};

export default SyllabusForm;