import React from 'react';

export type Role = 'Admin' | 'Accountant' | 'Teacher';
export type Campus = 'Brindabanpur' | 'Jagadishpur' | 'Barogram';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  campus: Campus;
  avatarUrl?: string;
}

export type LoginCredentials = Pick<User, 'email' | 'role' | 'campus'> & { password: string };
export type SignupDetails = Omit<User, 'id'> & { password: string };

export type ClassLevel = 'Nursery' | 'LKG' | 'UKG' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX' | 'X';
export type Gender = 'Male' | 'Female' | 'Other';
export type PaymentMode = 'Cash' | 'Online' | 'Bank Transfer' | 'Cheque';

export interface Student {
  id: string;
  registrationNumber: string;
  name: string;
  email: string;
  enrollmentDate: string;
  campus: Campus;
  
  // New Admission Fields
  appliedForClass: ClassLevel;
  session: string;
  fatherName: string;
  fatherQualification: string;
  fatherOccupation: string;
  motherName: string;
  motherQualification: string;
  motherOccupation: string;
  religion: string;
  nationality: string;
  gender: Gender;
  dateOfBirth: string;
  placeOfBirth: string;
  mobileNumber: string;
  whatsAppNumber: string;
  fullAddress: string;
  physicalDeformities: string; // "Yes" or "No", with description if Yes
  isOrphan: boolean;
  familyMonthlyIncome: number;
  
  // Document URLs (will store as base64 in mock)
  photoUrl?: string; 
  birthCertificateUrl?: string;

  // Financials
  admissionFees: number;
  readmissionFees: number;
  monthlyFees: number;
  concession: number;
  carFees: number;
  paymentMode: PaymentMode;
}


export interface Teacher {
  id: string;
  name:string;
  subject: string;
  email: string;
  phone: string;
  avatarUrl: string;
  campus: Campus;
  salary: number;
  joiningDate: string;
  qualification: string;
  address: string;
}

export interface Syllabus {
  id: string;
  title: string;
  subject: string;
  code: string;
  teacherName: string;
  teacherId: string;
  studentCount: number;
  description: string;
  campus: Campus;
  week: string;
  classLevel: ClassLevel;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  campus: Campus | 'All';
}

export type ExpenseCategory = 'Salaries' | 'Utilities' | 'Supplies' | 'Maintenance' | 'Other';

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  campus: Campus;
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentForMonth: string; // e.g., "January 2024"
  paymentMode: PaymentMode;
  collectedById: string; // User ID
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  expenseDate: string; // YYYY-MM-DD
  campus: Campus;
  recordedById: string; // User ID
}

export interface Reminder {
  id: string;
  title: string;
  dueDateTime: string; // ISO string
  isCompleted: boolean;
  isNotified: boolean;
  userId: string;
}


export type Page = 'Dashboard' | 'Students' | 'Teachers' | 'Syllabus' | 'Announcements' | 'Accounts' | 'Reminders' | 'Settings';

export interface NavItem {
    page: Page;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: Role[];
}