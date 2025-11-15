import React, { useState, useEffect, useMemo } from 'react';
import { FeePayment, Student, User } from '../types';
import { PAYMENT_MODES } from '../constants';

interface FeePaymentFormProps {
  user: User;
  students: Student[];
  onSave: (feeData: Omit<FeePayment, 'id' | 'collectedById' | 'studentName' | 'registrationNumber'>) => void;
  onCancel: () => void;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const FeePaymentForm: React.FC<FeePaymentFormProps> = ({ user, students, onSave, onCancel }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODES[0]);
  const [paymentForMonth, setPaymentForMonth] = useState(months[new Date().getMonth()]);
  const [paymentForYear, setPaymentForYear] = useState(currentYear);

  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find(s => s.id === selectedStudentId);
      if (student) {
        setAmount(student.monthlyFees + student.carFees);
      }
    } else {
        setAmount(0);
    }
  }, [selectedStudentId, students]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return students.filter(s => 
        s.name.toLowerCase().includes(lowercasedTerm) || 
        s.registrationNumber.toLowerCase().includes(lowercasedTerm)
    ).slice(0, 10); // Limit results for performance
  }, [searchTerm, students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
        alert("Please select a student.");
        return;
    }
    if (amount <= 0) {
        alert("Amount must be greater than zero.");
        return;
    }
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    onSave({
      studentId: selectedStudentId,
      campus: student.campus,
      amount,
      paymentDate,
      paymentForMonth: `${paymentForMonth} ${paymentForYear}`,
      paymentMode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="studentSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Student (by Name or Reg. No.)</label>
        <input 
          type="text" 
          id="studentSearch" 
          value={searchTerm} 
          onChange={e => { setSearchTerm(e.target.value); setSelectedStudentId(''); }} 
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Start typing to search..."
        />
        {searchTerm && filteredStudents.length > 0 && !selectedStudentId && (
          <ul className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md max-h-40 overflow-y-auto bg-white dark:bg-gray-800">
            {filteredStudents.map(student => (
              <li 
                key={student.id} 
                onClick={() => {
                  setSelectedStudentId(student.id);
                  setSearchTerm(`${student.name} (${student.registrationNumber})`);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
              >
                {student.name} ({student.registrationNumber}) - {student.campus}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input type="number" name="amount" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Mode</label>
          <select name="paymentMode" id="paymentMode" value={paymentMode} onChange={e => setPaymentMode(e.target.value as any)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              {PAYMENT_MODES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="paymentForMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">For Month</label>
              <select name="paymentForMonth" id="paymentForMonth" value={paymentForMonth} onChange={e => setPaymentForMonth(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="paymentForYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">For Year</label>
              <select name="paymentForYear" id="paymentForYear" value={paymentForYear} onChange={e => setPaymentForYear(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
        </div>
         <div>
          <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Date</label>
          <input type="date" name="paymentDate" id="paymentDate" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
      </div>
       <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Record Payment
        </button>
      </div>
    </form>
  );
};

export default FeePaymentForm;
