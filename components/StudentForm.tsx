import React, { useState, useEffect } from 'react';
import { Student, Campus } from '../types';
import { CLASS_LEVELS, SESSIONS, GENDERS, PAYMENT_MODES, CAMPUSES, getCampusPrefix } from '../constants';

interface StudentFormProps {
  student: Student | null;
  onSave: (studentData: Student | Omit<Student, 'id'>) => void;
  onCancel: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};


const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'registrationNumber'>>({
    name: '', email: '', enrollmentDate: new Date().toISOString().split('T')[0], campus: 'Brindabanpur', appliedForClass: 'Nursery',
    session: '2024', fatherName: '', fatherQualification: '', fatherOccupation: '', motherName: '', motherQualification: '',
    motherOccupation: '', religion: '', nationality: 'Indian', gender: 'Male', dateOfBirth: '', placeOfBirth: '',
    mobileNumber: '', whatsAppNumber: '', fullAddress: '', physicalDeformities: 'None', isOrphan: false,
    familyMonthlyIncome: 0, photoUrl: '', birthCertificateUrl: '', admissionFees: 0, readmissionFees: 0, monthlyFees: 0,
    concession: 0, carFees: 0, paymentMode: 'Cash'
  });
  const [regNumSuffix, setRegNumSuffix] = useState('');
  const [fileErrors, setFileErrors] = useState({ photo: '', cert: '' });
  const [calculatedAge, setCalculatedAge] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (student) {
      const { id, registrationNumber, ...editableData } = student;
      setFormData(editableData);
      
      const prefix = getCampusPrefix(student.campus);
      if (registrationNumber.startsWith(prefix)) {
        // Updated logic to handle prefixes like ICBR24
        const yearPrefixLength = prefix.length + 2;
        if (registrationNumber.length > yearPrefixLength) {
            setRegNumSuffix(registrationNumber.substring(yearPrefixLength));
        } else {
            setRegNumSuffix(registrationNumber.substring(prefix.length));
        }
      } else {
        // Fallback for unexpected registration number format
        setRegNumSuffix(registrationNumber);
      }
    } else {
        // Reset form for new student entry
        const defaultCampus: Campus = 'Brindabanpur';
        setFormData({
            name: '', email: '', enrollmentDate: new Date().toISOString().split('T')[0], campus: defaultCampus, appliedForClass: 'Nursery',
            session: '2024', fatherName: '', fatherQualification: '', fatherOccupation: '', motherName: '', motherQualification: '',
            motherOccupation: '', religion: '', nationality: 'Indian', gender: 'Male', dateOfBirth: '', placeOfBirth: '',
            mobileNumber: '', whatsAppNumber: '', fullAddress: '', physicalDeformities: 'None', isOrphan: false,
            familyMonthlyIncome: 0, photoUrl: '', birthCertificateUrl: '', admissionFees: 0, readmissionFees: 0, monthlyFees: 0,
            concession: 0, carFees: 0, paymentMode: 'Cash'
        });
        setRegNumSuffix('');
    }
  }, [student]);

  useEffect(() => {
    if (!formData.dateOfBirth) {
        setCalculatedAge(null);
        return;
    }
    
    const birthDate = new Date(formData.dateOfBirth);
    if (isNaN(birthDate.getTime())) {
        setCalculatedAge(null); 
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
        setCalculatedAge({ text: "Birth date cannot be in the future.", isError: true });
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += prevMonthLastDay;
    }

    if (months < 0) {
        years--;
        months += 12;
    }
    
    setCalculatedAge({ text: `${years} years, ${months} months, ${days} days`, isError: false });

  }, [formData.dateOfBirth]);
  
  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };

  const fieldsToTitleCase = [
    'name', 'fatherName', 'fatherQualification', 'fatherOccupation', 'motherName', 'motherQualification',
    'motherOccupation', 'religion', 'nationality', 'placeOfBirth', 'fullAddress', 'physicalDeformities'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        const isNumericField = ['familyMonthlyIncome', 'admissionFees', 'readmissionFees', 'monthlyFees', 'concession', 'carFees'].includes(name);
        
        let finalValue: string | number = value;
        if (isNumericField) {
            finalValue = Number(value);
        } else if (fieldsToTitleCase.includes(name)) {
            finalValue = toTitleCase(value);
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const errorKey = name === 'photoUrl' ? 'photo' : 'cert';

      // Validation
      if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
        setFileErrors(prev => ({...prev, [errorKey]: 'File must be a JPG.'}));
        return;
      }
      if (file.size > 1024 * 1024) { // 1MB
        setFileErrors(prev => ({...prev, [errorKey]: 'File size cannot exceed 1MB.'}));
        return;
      }
      
      setFileErrors(prev => ({...prev, [errorKey]: ''}));
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, [name]: base64 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = getCampusPrefix(formData.campus);
    const currentYearShort = new Date().getFullYear().toString().slice(-2);
    const fullRegistrationNumber = prefix + currentYearShort + regNumSuffix;
    
    const dataToSave = {
        ...formData,
        registrationNumber: student ? student.registrationNumber : fullRegistrationNumber
    };

    if (student) {
      onSave({ ...student, ...dataToSave });
    } else {
      onSave(dataToSave);
    }
  };
  
  const renderInput = (label: string, name: keyof Omit<Student, 'id' | 'registrationNumber'>, type = 'text', required = true) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input type={type} name={name} id={name} value={String(formData[name] ?? '')} onChange={handleChange} required={required} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
    </div>
  );
  
  const renderSelect = (label: string, name: keyof Omit<Student, 'id' | 'registrationNumber'>, options: readonly string[], required = true) => (
      <div>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          <select name={name} id={name} value={String(formData[name] ?? '')} onChange={handleChange} required={required} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
      </div>
  );

  const prefix = getCampusPrefix(formData.campus) + new Date().getFullYear().toString().slice(-2);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-md">
        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Admission Details</legend>
        <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number</label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                    {student ? getCampusPrefix(student.campus) + student.session.slice(-2) : prefix}
                </span>
                <input
                    type="text"
                    name="registrationNumber"
                    id="registrationNumber"
                    value={regNumSuffix}
                    onChange={(e) => setRegNumSuffix(e.target.value)}
                    required
                    disabled={!!student}
                    placeholder="001"
                    className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none rounded-r-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
                />
            </div>
        </div>
        {renderSelect('Campus', 'campus', CAMPUSES)}
        {renderSelect('Applied for Class', 'appliedForClass', CLASS_LEVELS)}
        {renderSelect('Session', 'session', SESSIONS)}
      </fieldset>

      <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md">
        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Student Information</legend>
        {renderInput('name', 'name')}
        {renderSelect('gender', 'gender', GENDERS)}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
          <input 
            type="date" 
            name="dateOfBirth" 
            id="dateOfBirth" 
            value={String(formData['dateOfBirth'] ?? '')} 
            onChange={handleChange} 
            required={true} 
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
          />
          {calculatedAge && (
            <p className={`mt-2 text-sm font-medium ${calculatedAge.isError ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {calculatedAge.isError ? calculatedAge.text : `Age: ${calculatedAge.text}`}
            </p>
          )}
        </div>
        {renderInput('placeOfBirth', 'placeOfBirth')}
        {renderInput('religion', 'religion')}
        {renderInput('nationality', 'nationality')}
      </fieldset>
      
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Parent's Information</legend>
        {renderInput("fatherName", 'fatherName')}
        {renderInput("fatherQualification", 'fatherQualification')}
        {renderInput("fatherOccupation", 'fatherOccupation')}
        {renderInput("motherName", 'motherName')}
        {renderInput("motherQualification", 'motherQualification')}
        {renderInput("motherOccupation", 'motherOccupation')}
      </fieldset>

      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Contact & Other Details</legend>
        {renderInput('mobileNumber', 'mobileNumber', 'tel')}
        {renderInput('whatsAppNumber', 'whatsAppNumber', 'tel')}
        <div className="md:col-span-2">
            <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Address</label>
            <textarea name="fullAddress" id="fullAddress" value={formData.fullAddress} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
        </div>
        {renderInput('physicalDeformities', 'physicalDeformities')}
        {renderInput('familyMonthlyIncome', 'familyMonthlyIncome', 'number')}
         <div className="flex items-center">
            <input type="checkbox" name="isOrphan" id="isOrphan" checked={formData.isOrphan} onChange={handleChange} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
            <label htmlFor="isOrphan" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Orphan</label>
        </div>
      </fieldset>
      
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md">
        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Document Upload</legend>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Passport Size Photo</label>
            <input type="file" name="photoUrl" accept=".jpg,.jpeg" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
            {fileErrors.photo && <p className="text-red-500 text-xs mt-1">{fileErrors.photo}</p>}
            {formData.photoUrl && <img src={formData.photoUrl} alt="Photo Preview" className="mt-2 h-24 w-24 object-cover rounded-md border"/>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birth Certificate</label>
            <input type="file" name="birthCertificateUrl" accept=".jpg,.jpeg" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
            {fileErrors.cert && <p className="text-red-500 text-xs mt-1">{fileErrors.cert}</p>}
            {formData.birthCertificateUrl && <img src={formData.birthCertificateUrl} alt="Certificate Preview" className="mt-2 h-24 w-auto rounded-md border"/>}
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 border rounded-md">
        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Financial Details</legend>
        {renderInput('admissionFees', 'admissionFees', 'number')}
        {renderInput('readmissionFees', 'readmissionFees', 'number', false)}
        {renderInput('monthlyFees', 'monthlyFees', 'number')}
        {renderInput('concession', 'concession', 'number', false)}
        {renderInput('carFees', 'carFees', 'number', false)}
        {renderSelect('paymentMode', 'paymentMode', PAYMENT_MODES)}
      </fieldset>

      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          {student ? 'Update Student' : 'Save Admission'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;