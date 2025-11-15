import React, { useState } from 'react';
import { Teacher } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface TeacherDetailsPrintProps {
  teacher: Teacher;
}

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="py-2 grid grid-cols-3 gap-4">
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{value}</dd>
  </div>
);

const TeacherDetailsPrint: React.FC<TeacherDetailsPrintProps> = ({ teacher }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = async () => {
    const printableElement = document.getElementById('printable-area');
    if (printableElement) {
        setIsPrinting(true);
        try {
            const canvas = await html2canvas(printableElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Needed for external avatar images
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${teacher.name.replace(/\s/g, '_')}_Profile.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error creating the PDF.");
        } finally {
            setIsPrinting(false);
        }
    }
  };

  return (
    <div>
      <div id="printable-area" className="bg-white dark:bg-gray-800 rounded-lg">
        {/* Header */}
        <div className="flex items-center p-4 border-b dark:border-gray-700">
          <img className="h-20 w-20 rounded-full object-cover" src={teacher.avatarUrl} alt={teacher.name} />
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{teacher.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.subject}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{teacher.campus} Campus</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <DetailRow label="Qualification" value={teacher.qualification} />
            <DetailRow label="Joining Date" value={teacher.joiningDate} />
            <DetailRow label="Email" value={teacher.email} />
            <DetailRow label="Phone" value={teacher.phone} />
            <DetailRow label="Address" value={teacher.address} />
            <DetailRow label="Salary" value={`₹${teacher.salary.toLocaleString()}`} />
          </dl>
        </div>
      </div>
       {/* Footer */}
        <div className="p-4 flex justify-end">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center disabled:bg-primary-300"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v-2a1 1 0 011-1h8a1 1 0 011 1v2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            {isPrinting ? 'Generating PDF...' : 'Print to PDF'}
          </button>
        </div>
    </div>
  );
};

export default TeacherDetailsPrint;