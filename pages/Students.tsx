import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Student, User } from '../types';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../services/mockApiService';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import StudentDetailsPrint from '../components/StudentDetailsPrint';
import { StudentsIcon } from '../constants';
import ImportCSVModal from '../components/ImportCSVModal';

interface StudentsProps {
  user: User;
}

const Students: React.FC<StudentsProps> = ({ user }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const data = await getStudents(user.campus, user.role);
    setStudents(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  
  const filteredStudents = useMemo(() => {
    if (!searchTerm) {
        return students;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return students.filter(student =>
        student.name.toLowerCase().includes(lowercasedTerm) ||
        student.email.toLowerCase().includes(lowercasedTerm) ||
        student.fatherName.toLowerCase().includes(lowercasedTerm) ||
        student.mobileNumber.includes(lowercasedTerm) ||
        student.registrationNumber.toLowerCase().includes(lowercasedTerm)
    );
  }, [students, searchTerm]);

  const handleAddClick = () => {
    setSelectedStudent(null);
    setIsFormModalOpen(true);
  };
  
  const handleViewClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsFormModalOpen(true);
  };
  
  const handleDeleteClick = async (studentId: string) => {
      if(window.confirm('Are you sure you want to delete this student?')) {
          await deleteStudent(studentId);
          fetchStudents();
      }
  };

  const handleSaveStudent = async (studentData: Student | Omit<Student, 'id'>) => {
    if ('id' in studentData) {
      await updateStudent(studentData);
    } else {
      await addStudent(studentData);
    }
    fetchStudents();
    setIsFormModalOpen(false);
  };
  
  const closeModal = () => {
      setIsFormModalOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedStudent(null);
  }
  
  const handleImportSuccess = () => {
      setIsImportModalOpen(false);
      fetchStudents();
  };

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      alert("No students to export.");
      return;
    }

    const escapeCsvField = (field: any): string => {
        const stringField = String(field ?? '');
        // If the field contains a comma, newline, or double quote, wrap it in double quotes
        if (/[",\n]/.test(stringField)) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    };

    const headers = [
      "Registration Number", "Name", "Email", "Enrollment Date", "Campus", "Class",
      "Session", "Father's Name", "Father Qualification", "Father Occupation", "Mother's Name", 
      "Mother Qualification", "Mother Occupation", "Religion", "Nationality", "Gender", 
      "Date of Birth", "Place of Birth", "Mobile Number", "WhatsApp Number", "Full Address", 
      "Physical Deformities", "Is Orphan", "Family Monthly Income", "Admission Fees", 
      "Readmission Fees", "Monthly Fees", "Concession", "Car Fees", "Payment Mode"
    ];

    const csvRows = [headers.join(',')];

    for (const student of filteredStudents) {
        const values = [
            student.registrationNumber, student.name, student.email, student.enrollmentDate, student.campus,
            student.appliedForClass, student.session, student.fatherName, student.fatherQualification,
            student.fatherOccupation, student.motherName, student.motherQualification, student.motherOccupation,
            student.religion, student.nationality, student.gender, student.dateOfBirth, student.placeOfBirth,
            student.mobileNumber, student.whatsAppNumber, student.fullAddress, student.physicalDeformities,
            student.isOrphan, student.familyMonthlyIncome, student.admissionFees, student.readmissionFees,
            student.monthlyFees, student.concession, student.carFees, student.paymentMode
        ].map(escapeCsvField);
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "students_export_full.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  if (loading) {
    return <div className="text-center p-10">Loading students...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search by name, email, father..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
        {user.role === 'Admin' && (
            <div className="flex items-center space-x-2">
                <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
                >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Import from CSV
                </button>
                <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export to CSV
                </button>
                <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
                >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Admission
                </button>
            </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class</th>
              {user.role === 'Admin' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campus</th>}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Father's Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mobile No.</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {student.photoUrl ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={student.photoUrl} alt={student.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <StudentsIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Reg No: {student.registrationNumber}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.appliedForClass}</td>
                    {user.role === 'Admin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.campus}</td>}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.fatherName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.mobileNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleViewClick(student)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200">View</button>
                      {user.role === 'Admin' && (
                        <>
                          <button onClick={() => handleEditClick(student)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">Edit</button>
                          <button onClick={() => handleDeleteClick(student.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={user.role === 'Admin' ? 6 : 5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No students found matching your search.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isFormModalOpen} onClose={closeModal} title={selectedStudent ? 'Edit Student Details' : 'New Admission Form'} size="3xl">
        <div className="max-h-[80vh] overflow-y-auto p-1">
          <StudentForm
            student={selectedStudent}
            onSave={handleSaveStudent}
            onCancel={closeModal}
          />
        </div>
      </Modal>
      
      <Modal isOpen={isDetailsModalOpen} onClose={closeModal} title="Student Admission Details" size="3xl">
          <div className="max-h-[80vh] overflow-y-auto p-1">
            {selectedStudent && <StudentDetailsPrint student={selectedStudent} />}
          </div>
      </Modal>

      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Students from CSV" size="3xl">
        <div className="max-h-[80vh] overflow-y-auto p-1">
          <ImportCSVModal onImportSuccess={handleImportSuccess} />
        </div>
      </Modal>
    </div>
  );
};

export default Students;