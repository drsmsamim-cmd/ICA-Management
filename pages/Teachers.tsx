import React, { useState, useEffect, useCallback } from 'react';
import { Teacher, User } from '../types';
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from '../services/mockApiService';
import Modal from '../components/Modal';
import TeacherForm from '../components/TeacherForm';
import TeacherDetailsPrint from '../components/TeacherDetailsPrint';

interface TeachersProps {
  user: User;
}

const Teachers: React.FC<TeachersProps> = ({ user }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    const data = await getTeachers(user.campus, user.role);
    setTeachers(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleAddClick = () => {
    setSelectedTeacher(null);
    setIsFormModalOpen(true);
  };
  
  const handleViewClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsFormModalOpen(true);
  };
  
  const handleDeleteClick = async (teacherId: string) => {
      if(window.confirm('Are you sure you want to delete this teacher?')) {
          await deleteTeacher(teacherId);
          fetchTeachers();
      }
  };

  const handleSaveTeacher = async (teacherData: Omit<Teacher, 'id' | 'avatarUrl'> | Teacher) => {
    if ('id' in teacherData) {
      await updateTeacher(teacherData as Teacher);
    } else {
      await addTeacher(teacherData as Omit<Teacher, 'id' | 'avatarUrl'>);
    }
    fetchTeachers();
    setIsFormModalOpen(false);
  };
  
  const closeModal = () => {
      setIsFormModalOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedTeacher(null);
  }


  if (loading) {
    return <div className="text-center p-10">Loading teachers...</div>;
  }

  return (
    <div>
       <div className="flex justify-end mb-4">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Teacher
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Teacher</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
              {user.role === 'Admin' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campus</th>}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joining Date</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={teacher.avatarUrl} alt={teacher.name} />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{teacher.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{teacher.subject}</td>
                {user.role === 'Admin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{teacher.campus}</td>}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{teacher.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{teacher.joiningDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleViewClick(teacher)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200">View</button>
                  <button onClick={() => handleEditClick(teacher)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">Edit</button>
                  <button onClick={() => handleDeleteClick(teacher.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       <Modal isOpen={isFormModalOpen} onClose={closeModal} title={selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}>
        <div className="max-h-[80vh] overflow-y-auto p-1">
          <TeacherForm
            teacher={selectedTeacher}
            onSave={handleSaveTeacher}
            onCancel={closeModal}
          />
        </div>
      </Modal>
      
      <Modal isOpen={isDetailsModalOpen} onClose={closeModal} title="Teacher Profile">
          {selectedTeacher && <TeacherDetailsPrint teacher={selectedTeacher} />}
      </Modal>
    </div>
  );
};

export default Teachers;