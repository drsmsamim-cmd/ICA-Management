import React, { useState, useEffect } from 'react';
import { Expense, Campus, User } from '../types';
import { EXPENSE_CATEGORIES, CAMPUSES } from '../constants';

interface ExpenseFormProps {
  user: User;
  onSave: (expenseData: Omit<Expense, 'id' | 'recordedById'>) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id' | 'recordedById' | 'campus'>>({
    category: 'Supplies',
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
  });
  const [campus, setCampus] = useState<Campus>(user.campus);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
        alert("Amount must be greater than zero.");
        return;
    }
    onSave({ ...formData, campus });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              {EXPENSE_CATEGORIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input type="date" name="expenseDate" id="expenseDate" value={formData.expenseDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        {user.role === 'Admin' && (
            <div>
                <label htmlFor="campus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Campus</label>
                <select name="campus" id="campus" value={campus} onChange={e => setCampus(e.target.value as Campus)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                    {CAMPUSES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        )}
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
          Save Expense
        </button>
      </div>
    </form>
  );
};
export default ExpenseForm;
