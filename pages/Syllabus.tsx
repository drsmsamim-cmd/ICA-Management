import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Syllabus, User, ClassLevel, Teacher } from '../types';
import { getSyllabi, getTeachers, addSyllabus, updateSyllabus, deleteSyllabus } from '../services/mockApiService';
import { CLASS_LEVELS } from '../constants';
import Modal from '../components/Modal';
import SyllabusForm from '../components/SyllabusForm';


interface SyllabusProps {
  user: User;
}

const SyllabusPage: React.FC<SyllabusProps> = ({ user }) => {
  const [allSyllabi, setAllSyllabi] = useState<Syllabus[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(CLASS_LEVELS[0]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [syllabiData, teachersData] = await Promise.all([
      getSyllabi(user.campus, user.role),
      getTeachers(user.campus, user.role) // Needed for the form dropdown
    ]);
    setAllSyllabi(syllabiData);
    setTeachers(teachersData);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSyllabi = useMemo(() => {
    return allSyllabi
      .filter(s => s.classLevel === selectedClass)
      .sort((a, b) => {
        const weekA = parseInt(a.week.replace('Week ', ''), 10);
        const weekB = parseInt(b.week.replace('Week ', ''), 10);
        return weekA - weekB;
      });
  }, [allSyllabi, selectedClass]);

  const handleAddClick = () => {
    setSelectedSyllabus(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (syllabusId: string) => {
    if (window.confirm('Are you sure you want to delete this syllabus entry?')) {
      await deleteSyllabus(syllabusId);
      fetchData();
    }
  };

  const handleSaveSyllabus = async (syllabusData: Syllabus | Omit<Syllabus, 'id' | 'teacherName'>) => {
    if ('id' in syllabusData) {
      await updateSyllabus(syllabusData);
    } else {
      await addSyllabus(syllabusData);
    }
    fetchData();
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSyllabus(null);
  };

  if (loading) {
    return <div className="text-center p-10">Loading weekly plans...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Weekly Teaching Plan</h2>
        <div className="flex items-center space-x-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="class-select" className="sr-only">Select Class</label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassLevel)}
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {CLASS_LEVELS.map(level => (
                <option key={level} value={level}>Class {level}</option>
              ))}
            </select>
          </div>
          {user.role === 'Admin' && (
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex-shrink-0"
            >
              New Weekly Plan
            </button>
          )}
        </div>
      </div>

      {filteredSyllabi.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabi.map((syllabus) => (
            <div key={syllabus.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{syllabus.title}</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-purple-200 dark:text-purple-900">{syllabus.week}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">{syllabus.subject}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Taught by {syllabus.teacherName}</p>
                  {user.role === 'Admin' && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{syllabus.campus} Campus</p>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{syllabus.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center px-6 pb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {syllabus.studentCount} Students
                </div>
                {user.role === 'Admin' && (
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleEditClick(syllabus)} className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">Edit</button>
                    <button onClick={() => handleDeleteClick(syllabus.id)} className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-500 dark:text-gray-400">No weekly plan found for Class {selectedClass}.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedSyllabus ? 'Edit Weekly Plan' : 'Create New Weekly Plan'}>
        <div className="max-h-[80vh] overflow-y-auto p-1">
          <SyllabusForm
            syllabus={selectedSyllabus}
            teachers={teachers}
            onSave={handleSaveSyllabus}
            onCancel={closeModal}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SyllabusPage;