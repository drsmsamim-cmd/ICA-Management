import React, { useState, useEffect, useCallback } from 'react';
import { User, FeePayment, Expense, Student, Campus } from '../types';
import { getAccountSummary, getFeePayments, getExpenses, addFeePayment, addExpense, getStudents } from '../services/mockApiService';
import Modal from '../components/Modal';
import FeePaymentForm from '../components/FeePaymentForm';
import ExpenseForm from '../components/ExpenseForm';
import { CAMPUSES } from '../constants';

interface AccountsProps {
  user: User;
}

type Tab = 'overview' | 'fees' | 'expenses';

const StatCard: React.FC<{ title: string, value: string, color: string }> = ({ title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);


const Accounts: React.FC<AccountsProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);
    
    // Data states
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, netProfit: 0 });
    const [payments, setPayments] = useState<FeePayment[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    // Modal states
    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    
    // Filter states
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(lastDayOfMonth);
    const [selectedCampus, setSelectedCampus] = useState<Campus>(user.campus);

    const campusForFilter = user.role === 'Admin' ? selectedCampus : user.campus;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [summaryData, paymentsData, expensesData, studentsData] = await Promise.all([
                getAccountSummary(campusForFilter, user.role, startDate, endDate),
                getFeePayments(campusForFilter, user.role),
                getExpenses(campusForFilter, user.role),
                getStudents(user.campus, user.role) // students for fee form
            ]);
            setSummary(summaryData);
            setPayments(paymentsData.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()));
            setExpenses(expensesData.sort((a,b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()));
            setStudents(studentsData);
        } catch (error) {
            console.error("Failed to fetch accounting data:", error);
        } finally {
            setLoading(false);
        }
    }, [user.role, user.campus, campusForFilter, startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveFee = async (feeData: Omit<FeePayment, 'id' | 'collectedById' | 'studentName' | 'registrationNumber'>) => {
        await addFeePayment(feeData, user.id);
        setIsFeeModalOpen(false);
        fetchData();
    };

    const handleSaveExpense = async (expenseData: Omit<Expense, 'id' | 'recordedById'>) => {
        await addExpense(expenseData, user.id);
        setIsExpenseModalOpen(false);
        fetchData();
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-10">Loading financial data...</div>;
        }

        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'fees': return renderFeeCollection();
            case 'expenses': return renderExpenses();
            default: return null;
        }
    };
    
    const renderOverview = () => (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Income" value={`₹${summary.totalIncome.toLocaleString()}`} color="text-green-500" />
                <StatCard title="Total Expenses" value={`₹${summary.totalExpenses.toLocaleString()}`} color="text-red-500" />
                <StatCard title="Net Profit / Loss" value={`₹${summary.netProfit.toLocaleString()}`} color={summary.netProfit >= 0 ? 'text-blue-500' : 'text-red-500'} />
            </div>
            <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="font-semibold text-lg mb-2">Note:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">The figures displayed above are for the selected date range and campus. Use the filters to analyze different periods or locations.</p>
            </div>
        </div>
    );
    
    const renderFeeCollection = () => (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={() => setIsFeeModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Record Fee Payment
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">For Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campus</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.studentName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{p.registrationNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{p.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{p.paymentDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{p.paymentForMonth}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{p.campus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const renderExpenses = () => (
         <div>
            <div className="flex justify-end mb-4">
                <button onClick={() => setIsExpenseModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Add New Expense
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campus</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {expenses.map(e => (
                            <tr key={e.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{e.expenseDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{e.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{e.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">₹{e.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{e.campus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );


    return (
        <div className="space-y-6">
            <div>
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">Select a tab</label>
                    <select id="tabs" name="tabs" onChange={e => setActiveTab(e.target.value as Tab)} value={activeTab} className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-primary-500 focus:ring-primary-500">
                        <option value="overview">Overview</option>
                        <option value="fees">Fee Collection</option>
                        <option value="expenses">Expenses</option>
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Overview</button>
                            <button onClick={() => setActiveTab('fees')} className={`${activeTab === 'fees' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Fee Collection</button>
                            <button onClick={() => setActiveTab('expenses')} className={`${activeTab === 'expenses' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Expenses</button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Filters */}
             <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                {user.role === 'Admin' && (
                     <div className="flex-1 min-w-[150px]">
                        <label htmlFor="campusFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Campus</label>
                         <select id="campusFilter" value={selectedCampus} onChange={e => setSelectedCampus(e.target.value as Campus)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                            {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                )}
            </div>

            <div>{renderContent()}</div>

            <Modal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} title="Record Fee Payment">
                 <div className="max-h-[80vh] overflow-y-auto p-1">
                    <FeePaymentForm user={user} students={students} onSave={handleSaveFee} onCancel={() => setIsFeeModalOpen(false)} />
                 </div>
            </Modal>
             <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add New Expense">
                <div className="max-h-[80vh] overflow-y-auto p-1">
                    <ExpenseForm user={user} onSave={handleSaveExpense} onCancel={() => setIsExpenseModalOpen(false)} />
                 </div>
            </Modal>
        </div>
    );
};

export default Accounts;