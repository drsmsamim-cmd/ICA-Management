import React, { useState } from 'react';
import { Student } from '../types';
import { addStudentsBatch } from '../services/mockApiService';
import { CAMPUSES, CLASS_LEVELS, GENDERS, PAYMENT_MODES, SESSIONS } from '../constants';

interface ImportCSVModalProps {
  onImportSuccess: () => void;
}

type ParsedStudent = Omit<Student, 'id' | 'registrationNumber'> & {
    isValid: boolean;
    errors: string[];
};
type ProcessingState = 'idle' | 'parsing' | 'preview' | 'importing' | 'done';

const CSV_TEMPLATE_HEADERS = [
    'name', 'email', 'enrollmentDate', 'campus', 'appliedForClass', 'session',
    'fatherName', 'fatherQualification', 'fatherOccupation', 'motherName', 'motherQualification', 'motherOccupation',
    'religion', 'nationality', 'gender', 'dateOfBirth', 'placeOfBirth', 'mobileNumber', 'whatsAppNumber',
    'fullAddress', 'physicalDeformities', 'isOrphan', 'familyMonthlyIncome', 'admissionFees', 'readmissionFees',
    'monthlyFees', 'concession', 'carFees', 'paymentMode'
].join(',');

const REQUIRED_FIELDS: (keyof Omit<Student, 'id' | 'registrationNumber'>)[] = [
    'name', 'campus', 'appliedForClass', 'session', 'fatherName', 'mobileNumber', 'dateOfBirth'
];

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({ onImportSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedStudent[] | null>(null);
    const [processingState, setProcessingState] = useState<ProcessingState>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError(null);
            setParsedData(null);
            setProcessingState('idle');
        } else {
            setError('Please select a valid .csv file.');
            setFile(null);
        }
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([CSV_TEMPLATE_HEADERS], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "student_import_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const parseAndValidateCSV = (csvText: string): ParsedStudent[] => {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].trim().split(',').map(h => h.trim());
        
        if(headers.length < REQUIRED_FIELDS.length || !REQUIRED_FIELDS.every(h => headers.includes(h))) {
            throw new Error(`CSV headers are missing or invalid. Please use the template. Required headers include: ${REQUIRED_FIELDS.join(', ')}`);
        }
        
        const rows = lines.slice(1);
        return rows.map((line) => {
            const values = line.trim().match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
            const rowData: { [key: string]: any } = {};
            
            headers.forEach((header, i) => {
                 let value = (values[i] || '').trim();
                 if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1).replace(/""/g, '"');
                 }
                 rowData[header] = value;
            });
            
            const errors: string[] = [];
            
            REQUIRED_FIELDS.forEach(field => {
                if (!rowData[field]) {
                    errors.push(`${field} is required.`);
                }
            });

            if (rowData.campus && !CAMPUSES.includes(rowData.campus as any)) errors.push(`Invalid campus: ${rowData.campus}`);
            if (rowData.appliedForClass && !CLASS_LEVELS.includes(rowData.appliedForClass as any)) errors.push(`Invalid class: ${rowData.appliedForClass}`);
            if (rowData.session && !SESSIONS.includes(rowData.session)) errors.push(`Invalid session: ${rowData.session}`);
            if (rowData.gender && !GENDERS.includes(rowData.gender as any)) errors.push(`Invalid gender: ${rowData.gender}`);
            if (rowData.paymentMode && !PAYMENT_MODES.includes(rowData.paymentMode as any)) errors.push(`Invalid payment mode: ${rowData.paymentMode}`);

            const numericFields = ['familyMonthlyIncome', 'admissionFees', 'readmissionFees', 'monthlyFees', 'concession', 'carFees'];
            numericFields.forEach(field => {
                if(rowData[field] && isNaN(Number(rowData[field]))) {
                    errors.push(`${field} must be a number.`);
                }
            });

            return {
                name: rowData.name || '',
                email: rowData.email || '',
                enrollmentDate: rowData.enrollmentDate || new Date().toISOString().split('T')[0],
                campus: rowData.campus || 'Brindabanpur',
                appliedForClass: rowData.appliedForClass || 'Nursery',
                session: rowData.session || '2024',
                fatherName: rowData.fatherName || '',
                fatherQualification: rowData.fatherQualification || '',
                fatherOccupation: rowData.fatherOccupation || '',
                motherName: rowData.motherName || '',
                motherQualification: rowData.motherQualification || '',
                motherOccupation: rowData.motherOccupation || '',
                religion: rowData.religion || '',
                nationality: rowData.nationality || 'Indian',
                gender: rowData.gender || 'Male',
                dateOfBirth: rowData.dateOfBirth || '',
                placeOfBirth: rowData.placeOfBirth || '',
                mobileNumber: rowData.mobileNumber || '',
                whatsAppNumber: rowData.whatsAppNumber || '',
                fullAddress: rowData.fullAddress || '',
                physicalDeformities: rowData.physicalDeformities || 'None',
                isOrphan: ['true', 'yes', '1'].includes(String(rowData.isOrphan).toLowerCase()),
                familyMonthlyIncome: Number(rowData.familyMonthlyIncome) || 0,
                admissionFees: Number(rowData.admissionFees) || 0,
                readmissionFees: Number(rowData.readmissionFees) || 0,
                monthlyFees: Number(rowData.monthlyFees) || 0,
                concession: Number(rowData.concession) || 0,
                carFees: Number(rowData.carFees) || 0,
                paymentMode: rowData.paymentMode || 'Cash',
                photoUrl: '',
                birthCertificateUrl: '',
                isValid: errors.length === 0,
                errors,
            };
        });
    };

    const handleProcessFile = () => {
        if (!file) return;

        setProcessingState('parsing');
        setError(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const results = parseAndValidateCSV(text);
                setParsedData(results);
                setProcessingState('preview');
            } catch (err: any) {
                setError(err.message);
                setProcessingState('idle');
            }
        };
        reader.onerror = () => {
            setError('Failed to read the file.');
            setProcessingState('idle');
        };
        reader.readAsText(file);
    };
    
    const handleConfirmImport = async () => {
        if (!parsedData) return;
        
        const validStudents = parsedData.filter(p => p.isValid);
        if (validStudents.length === 0) {
            setError("No valid students to import.");
            return;
        }

        setProcessingState('importing');
        try {
            await addStudentsBatch(validStudents);
            setProcessingState('done');
            setTimeout(() => {
                onImportSuccess();
            }, 1500);
        } catch (err: any) {
            setError(err.message || "An error occurred during import.");
            setProcessingState('preview');
        }
    };

    const validCount = parsedData?.filter(p => p.isValid).length || 0;
    const invalidCount = parsedData?.filter(p => !p.isValid).length || 0;

    return (
        <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md space-y-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Download the CSV template to ensure your data is in the correct format.</li>
                    <li>Fill in the student details. Required columns are: <strong>{REQUIRED_FIELDS.join(', ')}</strong>.</li>
                    <li>Upload the completed CSV file.</li>
                    <li>Review the parsed data and fix any errors in your file before confirming the import.</li>
                </ol>
                <button onClick={handleDownloadTemplate} className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                    Download Template
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900 file:text-primary-700 dark:file:text-primary-200 hover:file:bg-primary-100 dark:hover:file:bg-primary-800"
                />
                <button onClick={handleProcessFile} disabled={!file || processingState === 'parsing'} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
                    {processingState === 'parsing' ? 'Processing...' : 'Process File'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            {processingState === 'preview' && parsedData && (
                <div className="space-y-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium">
                        Found {validCount} valid student(s) and <span className="text-red-500">{invalidCount} invalid row(s)</span>.
                    </div>
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-md max-h-64">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                             <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Campus</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Class</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Errors</th>
                                </tr>
                             </thead>
                             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {parsedData.map((student, index) => (
                                    <tr key={index} className={!student.isValid ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {student.isValid ? 
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Valid</span> :
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Invalid</span>
                                            }
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{student.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.campus}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.appliedForClass}</td>
                                        <td className="px-4 py-2 text-xs text-red-600 dark:text-red-400">{student.errors.join(', ')}</td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                     <div className="flex justify-end">
                        <button onClick={handleConfirmImport} disabled={validCount === 0 || processingState !== 'preview'} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                            Confirm and Import {validCount} Student(s)
                        </button>
                    </div>
                </div>
            )}
            
            {processingState === 'importing' && <p className="text-center font-semibold text-primary-600">Importing students, please wait...</p>}
            {processingState === 'done' && <p className="text-center font-semibold text-green-600">Import successful! The student list will be refreshed.</p>}

        </div>
    );
};

export default ImportCSVModal;
