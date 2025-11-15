import React, { useState } from 'react';
import { Student } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StudentDetailsPrintProps {
  student: Student;
}

const DetailRow: React.FC<{ label: string; value?: string | number | boolean }> = ({ label, value }) => (
  <div className="py-2 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0">
    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{String(value)}</dd>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2 mt-4 first:mt-0">{children}</h3>
);

const StudentDetailsPrint: React.FC<StudentDetailsPrintProps> = ({ student }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = async () => {
    const printableElement = document.getElementById('printable-admission-form');
    if (!printableElement) {
      console.error('Printable element not found!');
      return;
    }

    setIsPrinting(true);

    const clone = printableElement.cloneNode(true) as HTMLElement;
    const birthCertSectionInClone = clone.querySelector('#birth-certificate-section');
    if (birthCertSectionInClone) {
      birthCertSectionInClone.remove();
    }

    // Style and append clone to be rendered off-screen
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '-9999px';
    clone.style.width = `${printableElement.offsetWidth}px`;
    
    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${student.name.replace(/\s/g, '_')}_Admission_Form.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, there was an error creating the PDF.");
    } finally {
      // Clean up by removing the clone from the DOM
      document.body.removeChild(clone);
      setIsPrinting(false);
    }
  };

  return (
    <div>
      <div id="printable-admission-form" className="bg-white dark:bg-gray-800 rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b dark:border-gray-700">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Student Admission Form</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reg. No: {student.registrationNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">ICA - {student.campus} Campus</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Session: {student.session}</p>
            </div>
            {student.photoUrl && (
                <img className="h-28 w-28 rounded-md object-cover border-2 border-gray-200" src={student.photoUrl} alt={student.name} />
            )}
        </div>

        {/* Body */}
        <div className="mt-4">
            <SectionTitle>Admission Details</SectionTitle>
            <dl>
                <DetailRow label="Applied for Class" value={student.appliedForClass} />
                <DetailRow label="Enrollment Date" value={student.enrollmentDate} />
            </dl>

            <SectionTitle>Student Information</SectionTitle>
            <dl>
                <DetailRow label="Full Name" value={student.name} />
                <DetailRow label="Gender" value={student.gender} />
                <DetailRow label="Date of Birth" value={student.dateOfBirth} />
                <DetailRow label="Place of Birth" value={student.placeOfBirth} />
                <DetailRow label="Religion" value={student.religion} />
                <DetailRow label="Nationality" value={student.nationality} />
            </dl>

            <SectionTitle>Parent's Information</SectionTitle>
            <dl>
                <DetailRow label="Father's Name" value={student.fatherName} />
                <DetailRow label="Father's Qualification" value={student.fatherQualification} />
                <DetailRow label="Father's Occupation" value={student.fatherOccupation} />
                <DetailRow label="Mother's Name" value={student.motherName} />
                <DetailRow label="Mother's Qualification" value={student.motherQualification} />
                <DetailRow label="Mother's Occupation" value={student.motherOccupation} />
            </dl>
            
            <SectionTitle>Contact & Other Details</SectionTitle>
            <dl>
                <DetailRow label="Email" value={student.email} />
                <DetailRow label="Mobile Number" value={student.mobileNumber} />
                <DetailRow label="WhatsApp Number" value={student.whatsAppNumber} />
                <DetailRow label="Full Address" value={student.fullAddress} />
                <DetailRow label="Physical Deformities" value={student.physicalDeformities} />
                <DetailRow label="Orphan" value={student.isOrphan ? "Yes" : "No"} />
                <DetailRow label="Family Monthly Income" value={`₹${student.familyMonthlyIncome.toLocaleString()}`} />
            </dl>

            <SectionTitle>Financial Details</SectionTitle>
             <dl>
                <DetailRow label="Admission Fees" value={`₹${student.admissionFees.toLocaleString()}`} />
                <DetailRow label="Readmission Fees" value={`₹${student.readmissionFees.toLocaleString()}`} />
                <DetailRow label="Monthly Fees" value={`₹${student.monthlyFees.toLocaleString()}`} />
                <DetailRow label="Concession" value={`₹${student.concession.toLocaleString()}`} />
                <DetailRow label="Car Fees" value={`₹${student.carFees.toLocaleString()}`} />
                <DetailRow label="Payment Mode" value={student.paymentMode} />
            </dl>

            {student.birthCertificateUrl && (
                <div id="birth-certificate-section" className="mt-6">
                    <SectionTitle>Birth Certificate</SectionTitle>
                    <img src={student.birthCertificateUrl} alt="Birth Certificate" className="mt-2 max-w-full rounded-md border"/>
                </div>
            )}
        </div>
      </div>
       {/* Footer / Action Button */}
        <div className="p-4 flex justify-end bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center disabled:bg-primary-300"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v-2a1 1 0 011-1h8a1 1 0 011 1v2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            {isPrinting ? 'Generating PDF...' : 'Print Admission Form'}
          </button>
        </div>
    </div>
  );
};

export default StudentDetailsPrint;
