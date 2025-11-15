import React from 'react';
import { NavItem, Campus, Role, ClassLevel, Gender, PaymentMode, ExpenseCategory } from './types';

// Icon Components
export const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const StudentsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const TeachersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const SyllabusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 21.75l4.5-4.5m0 0l4.5-4.5m-4.5 4.5L5.25 12" />
  </svg>
);

export const AnnouncementsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.354a1.76 1.76 0 011.164-2.288l5.517-1.727a1.13 1.13 0 00.884-.986 1.76 1.76 0 013.417-.592l2.147 6.354a1.76 1.76 0 01-1.164 2.288l-5.517 1.727a1.13 1.13 0 00-.884.986z" />
  </svg>
);

export const AccountsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v-.75A.75.75 0 015.25 4.5h-.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75m0 0v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75m0 0v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75M15 4.5v.75A.75.75 0 0114.25 6h-.75m0 0v-.75a.75.75 0 01.75-.75h.75M15 6h.75a.75.75 0 01.75.75v.75m0 0v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75m0 0v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75m0 0v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);

export const RemindersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h3m-3 6h3m-3 6h3m-6-3a9 9 0 1118 0 9 9 0 01-18 0zM12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
);


export const CAMPUSES: Campus[] = ['Brindabanpur', 'Jagadishpur', 'Barogram'];
export const ROLES: Role[] = ['Admin', 'Accountant', 'Teacher'];

export const NAV_ITEMS: NavItem[] = [
  { page: 'Dashboard', label: 'Dashboard', icon: DashboardIcon, roles: ['Admin', 'Accountant', 'Teacher'] },
  { page: 'Students', label: 'Students', icon: StudentsIcon, roles: ['Admin', 'Teacher'] },
  { page: 'Teachers', label: 'Teachers', icon: TeachersIcon, roles: ['Admin'] },
  { page: 'Syllabus', label: 'Syllabus', icon: SyllabusIcon, roles: ['Admin', 'Teacher'] },
  { page: 'Accounts', label: 'Accounts', icon: AccountsIcon, roles: ['Admin', 'Accountant'] },
  { page: 'Reminders', label: 'Reminders', icon: RemindersIcon, roles: ['Admin', 'Accountant', 'Teacher'] },
  { page: 'Announcements', label: 'Announcements', icon: AnnouncementsIcon, roles: ['Admin', 'Accountant', 'Teacher'] },
  { page: 'Settings', label: 'Settings', icon: SettingsIcon, roles: ['Admin', 'Accountant', 'Teacher'] },
];

export const CLASS_LEVELS: ClassLevel[] = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
export const SESSIONS: string[] = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());
export const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
export const PAYMENT_MODES: PaymentMode[] = ['Cash', 'Online', 'Bank Transfer', 'Cheque'];
export const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Other'];
export const WEEKS: string[] = Array.from({ length: 20 }, (_, i) => `Week ${i + 1}`);

export const getCampusPrefix = (campus: Campus): string => {
    switch (campus) {
        case 'Brindabanpur': return 'ICBR';
        case 'Jagadishpur': return 'ICJG';
        case 'Barogram': return 'ICBO';
        default: return '';
    }
};