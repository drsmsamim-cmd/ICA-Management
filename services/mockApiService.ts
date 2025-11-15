import { User, Student, Teacher, Syllabus, Announcement, Role, Campus, LoginCredentials, SignupDetails, FeePayment, Expense, ClassLevel, Reminder } from '../types';
import { getCampusPrefix } from '../constants';

const USERS_STORAGE_key = 'school-management-users';
const REMINDERS_STORAGE_KEY = 'school-management-reminders';
const ANNOUNCEMENTS_STORAGE_KEY = 'school-management-announcements';
const STUDENTS_STORAGE_KEY = 'school-management-students';
const TEACHERS_STORAGE_KEY = 'school-management-teachers';
const SYLLABI_STORAGE_KEY = 'school-management-syllabi';
const FEE_PAYMENTS_STORAGE_KEY = 'school-management-fee-payments';
const EXPENSES_STORAGE_KEY = 'school-management-expenses';


// --- USER DATABASE ---
const initialUsers: (User & { passwordHash: string })[] = [
    { id: 'U001', name: 'Admin User', email: 'admin@school.com', role: 'Admin', campus: 'Brindabanpur', passwordHash: 'admin123', avatarUrl: undefined },
    { id: 'U002', name: 'Jagadishpur Admin', email: 'admin-j@school.com', role: 'Admin', campus: 'Jagadishpur', passwordHash: 'admin123', avatarUrl: undefined },
    { id: 'U003', name: 'Accountant User', email: 'accountant@school.com', role: 'Accountant', campus: 'Brindabanpur', passwordHash: 'acc123', avatarUrl: undefined },
    { id: 'T01', name: 'Mr. John Doe', email: 'john.doe@school.com', role: 'Teacher', campus: 'Brindabanpur', passwordHash: 'teach123', avatarUrl: 'https://picsum.photos/seed/T01/200' },
];

let users: (User & { passwordHash: string })[] = [];

const loadUsersFromStorage = () => {
    try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_key);
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        } else {
            users = initialUsers;
            localStorage.setItem(USERS_STORAGE_key, JSON.stringify(users));
        }
    } catch (e) {
        console.error("Failed to load or parse users from localStorage", e);
        users = initialUsers;
    }
};

const saveUsersToStorage = () => {
    try {
        localStorage.setItem(USERS_STORAGE_key, JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save users to localStorage", e);
    }
};

// --- ANNOUNCEMENTS DATABASE ---
const initialAnnouncements: Announcement[] = [
    { id: 'A001', title: 'Welcome Back!', content: 'Welcome to the new academic year.', date: '2023-09-01', author: 'Principal', campus: 'All' },
    { id: 'A002', title: 'Parent-Teacher Conference (Brindabanpur)', content: 'Conferences will be held on October 15th.', date: '2023-09-20', author: 'Administration', campus: 'Brindabanpur' },
    { id: 'A003', title: 'Science Fair (Jagadishpur)', content: 'The annual science fair is scheduled for November 5th.', date: '2023-10-02', author: 'Science Dept.', campus: 'Jagadishpur' },
];

let announcements: Announcement[] = [];

const loadAnnouncementsFromStorage = () => {
    try {
        const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
        if (stored) {
            announcements = JSON.parse(stored);
        } else {
            announcements = initialAnnouncements;
            saveAnnouncementsToStorage();
        }
    } catch (e) {
        console.error("Failed to load announcements", e);
        announcements = initialAnnouncements;
    }
};

const saveAnnouncementsToStorage = () => {
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
};

// --- STUDENTS DATABASE ---
const initialStudents: Student[] = [
  { 
    id: 'S001', name: 'Alice Johnson', email: 'alice.j@example.com', enrollmentDate: '2022-09-01', campus: 'Brindabanpur',
    registrationNumber: 'ICBR22001',
    appliedForClass: 'X', session: '2022', fatherName: 'Robert Johnson', fatherQualification: 'M.Sc.', fatherOccupation: 'Engineer',
    motherName: 'Mary Johnson', motherQualification: 'B.A.', motherOccupation: 'Homemaker', religion: 'Christianity', nationality: 'American',
    gender: 'Female', dateOfBirth: '2006-05-10', placeOfBirth: 'New York', mobileNumber: '111-222-3333', whatsAppNumber: '111-222-3333',
    fullAddress: '123 Maple Street, Springfield, 12345', physicalDeformities: 'None', isOrphan: false, familyMonthlyIncome: 5000,
    admissionFees: 1000, readmissionFees: 0, monthlyFees: 200, concession: 0, carFees: 50, paymentMode: 'Online'
  },
  { 
    id: 'S002', name: 'Bob Smith', email: 'bob.s@example.com', enrollmentDate: '2021-09-01', campus: 'Brindabanpur',
    registrationNumber: 'ICBR21001',
    appliedForClass: 'X', session: '2021', fatherName: 'James Smith', fatherQualification: 'Ph.D.', fatherOccupation: 'Professor',
    motherName: 'Patricia Smith', motherQualification: 'M.A.', motherOccupation: 'Teacher', religion: 'Hinduism', nationality: 'Indian',
    gender: 'Male', dateOfBirth: '2005-08-15', placeOfBirth: 'Mumbai', mobileNumber: '444-555-6666', whatsAppNumber: '444-555-6666',
    fullAddress: '456 Oak Avenue, Mumbai, 400001', physicalDeformities: 'None', isOrphan: false, familyMonthlyIncome: 8000,
    admissionFees: 1200, readmissionFees: 0, monthlyFees: 250, concession: 10, carFees: 50, paymentMode: 'Bank Transfer'
  },
  { 
    id: 'S003', name: 'Charlie Brown', email: 'charlie.b@example.com', enrollmentDate: '2023-09-01', campus: 'Jagadishpur',
    registrationNumber: 'ICJA23001',
    appliedForClass: 'IX', session: '2023', fatherName: 'David Brown', fatherQualification: 'B.E.', fatherOccupation: 'Software Dev',
    motherName: 'Jennifer Brown', motherQualification: 'B.Sc.', motherOccupation: 'Analyst', religion: 'Christianity', nationality: 'Canadian',
    gender: 'Male', dateOfBirth: '2007-02-20', placeOfBirth: 'Toronto', mobileNumber: '777-888-9999', whatsAppNumber: '777-888-9999',
    fullAddress: '789 Pine Road, Toronto, M5H 2N2', physicalDeformities: 'None', isOrphan: false, familyMonthlyIncome: 6500,
    admissionFees: 1000, readmissionFees: 0, monthlyFees: 200, concession: 0, carFees: 0, paymentMode: 'Cash'
  },
];
let students: Student[] = [];
const loadStudentsFromStorage = () => {
    try {
        const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
        if (stored) {
            students = JSON.parse(stored);
        } else {
            students = initialStudents;
            saveStudentsToStorage();
        }
    } catch (e) {
        console.error("Failed to load students", e);
        students = initialStudents;
    }
};
const saveStudentsToStorage = () => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
};


// --- TEACHERS DATABASE ---
const initialTeachers: Teacher[] = [
    { id: 'T01', name: 'Mr. John Doe', subject: 'Mathematics', email: 'john.doe@school.com', phone: '123-456-7890', avatarUrl: 'https://picsum.photos/seed/T01/200', campus: 'Brindabanpur', salary: 60000, joiningDate: '2020-08-15', qualification: 'M.Ed in Mathematics', address: '123 Math Lane, Brindabanpur' },
    { id: 'T02', name: 'Ms. Jane Smith', subject: 'Science', email: 'jane.smith@school.com', phone: '234-567-8901', avatarUrl: 'https://picsum.photos/seed/T02/200', campus: 'Jagadishpur', salary: 62000, joiningDate: '2019-07-22', qualification: 'M.Sc in Biology', address: '456 Science Ave, Jagadishpur' },
    { id: 'T03', name: 'Dr. Emily White', subject: 'History', email: 'emily.white@school.com', phone: '345-678-9012', avatarUrl: 'https://picsum.photos/seed/T03/200', campus: 'Barogram', salary: 75000, joiningDate: '2018-05-10', qualification: 'Ph.D in History', address: '789 History Blvd, Barogram' },
    { id: 'T04', name: 'Mr. Robert Brown', subject: 'English', email: 'robert.brown@school.com', phone: '456-789-0123', avatarUrl: 'https://picsum.photos/seed/T04/200', campus: 'Brindabanpur', salary: 58000, joiningDate: '2021-01-30', qualification: 'M.A. in English Literature', address: '101 English St, Brindabanpur' },
];
let teachers: Teacher[] = [];
const loadTeachersFromStorage = () => {
    try {
        const stored = localStorage.getItem(TEACHERS_STORAGE_KEY);
        if (stored) {
            teachers = JSON.parse(stored);
        } else {
            teachers = initialTeachers;
            saveTeachersToStorage();
        }
    } catch (e) {
        console.error("Failed to load teachers", e);
        teachers = initialTeachers;
    }
};
const saveTeachersToStorage = () => {
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
};


// --- SYLLABI DATABASE ---
const initialSyllabi: Syllabus[] = [
    // Nursery
    { id: 'C201', title: 'Letter Recognition (A-C)', subject: 'English', code: 'NUR-ENG-1', teacherName: 'Mr. Robert Brown', teacherId: 'T04', studentCount: 15, description: 'Recognizing and pronouncing the first three letters of the alphabet.', campus: 'Brindabanpur', week: 'Week 1', classLevel: 'Nursery' },
    { id: 'C202', title: 'Counting 1-5', subject: 'Mathematics', code: 'NUR-MAT-1', teacherName: 'Mr. John Doe', teacherId: 'T01', studentCount: 15, description: 'Counting objects and recognizing numbers from 1 to 5.', campus: 'Brindabanpur', week: 'Week 1', classLevel: 'Nursery' },
    { id: 'C203', title: 'Letter Recognition (D-F)', subject: 'English', code: 'NUR-ENG-2', teacherName: 'Mr. Robert Brown', teacherId: 'T04', studentCount: 15, description: 'Continuing with the next three letters.', campus: 'Brindabanpur', week: 'Week 2', classLevel: 'Nursery' },
    { id: 'C204', title: 'Shapes: Circle & Square', subject: 'Mathematics', code: 'NUR-MAT-2', teacherName: 'Mr. John Doe', teacherId: 'T01', studentCount: 15, description: 'Identifying and drawing circles and squares.', campus: 'Brindabanpur', week: 'Week 2', classLevel: 'Nursery' },
    
    // LKG
    { id: 'C301', title: 'Phonics: Vowel Sounds', subject: 'English', code: 'LKG-ENG-1', teacherName: 'Mr. Robert Brown', teacherId: 'T04', studentCount: 20, description: 'Introduction to short vowel sounds (a, e, i, o, u).', campus: 'Brindabanpur', week: 'Week 1', classLevel: 'LKG' },
    { id: 'C302', title: 'Addition up to 10', subject: 'Mathematics', code: 'LKG-MAT-1', teacherName: 'Mr. John Doe', teacherId: 'T01', studentCount: 20, description: 'Simple addition using pictures and objects.', campus: 'Brindabanpur', week: 'Week 1', classLevel: 'LKG' },

    // Class X
    { id: 'C101', title: 'Algebra II - Chapter 1', subject: 'Mathematics', code: 'MATH-201', teacherName: 'Mr. John Doe', teacherId: 'T01', studentCount: 25, description: 'Advanced algebra concepts, focusing on linear equations.', campus: 'Brindabanpur', week: 'Week 1', classLevel: 'X' },
    { id: 'C105', title: 'Algebra II - Chapter 2', subject: 'Mathematics', code: 'MATH-201', teacherName: 'Mr. John Doe', teacherId: 'T01', studentCount: 25, description: 'Introduction to polynomials.', campus: 'Brindabanpur', week: 'Week 2', classLevel: 'X' },
    { id: 'C102', title: 'Biology - Cell Structure', subject: 'Science', code: 'SCI-101', teacherName: 'Ms. Jane Smith', teacherId: 'T02', studentCount: 30, description: 'Introduction to biological sciences and cell theory.', campus: 'Jagadishpur', week: 'Week 1', classLevel: 'X' },
    { id: 'C106', title: 'Biology - Photosynthesis', subject: 'Science', code: 'SCI-101', teacherName: 'Ms. Jane Smith', teacherId: 'T02', studentCount: 30, description: 'Understanding the process of photosynthesis.', campus: 'Jagadishpur', week: 'Week 2', classLevel: 'X' },
    { id: 'C103', title: 'Ancient Rome', subject: 'World History', code: 'HIST-202', teacherName: 'Dr. Emily White', teacherId: 'T03', studentCount: 28, description: 'The rise and fall of the Roman Empire.', campus: 'Barogram', week: 'Week 1', classLevel: 'X' },
    { id: 'C104', title: "Shakespeare's Hamlet", subject: 'Literature', code: 'ENG-301', teacherName: 'Mr. Robert Brown', teacherId: 'T04', studentCount: 22, description: 'Analysis of classic and modern literature.', campus: 'Brindabanpur', week: 'Week 1', classLevel: 'X' },
];
let syllabi: Syllabus[] = [];
const loadSyllabiFromStorage = () => {
    try {
        const stored = localStorage.getItem(SYLLABI_STORAGE_KEY);
        if (stored) {
            syllabi = JSON.parse(stored);
        } else {
            syllabi = initialSyllabi;
            saveSyllabiToStorage();
        }
    } catch (e) {
        console.error("Failed to load syllabi", e);
        syllabi = initialSyllabi;
    }
};
const saveSyllabiToStorage = () => {
    localStorage.setItem(SYLLABI_STORAGE_KEY, JSON.stringify(syllabi));
};

// --- FEE PAYMENTS DATABASE ---
const initialFeePayments: FeePayment[] = [
    { id: 'FP001', studentId: 'S001', studentName: 'Alice Johnson', registrationNumber: 'ICBR22001', campus: 'Brindabanpur', amount: 250, paymentDate: '2024-07-05', paymentForMonth: 'July 2024', paymentMode: 'Online', collectedById: 'U003' },
    { id: 'FP002', studentId: 'S002', studentName: 'Bob Smith', registrationNumber: 'ICBR21001', campus: 'Brindabanpur', amount: 300, paymentDate: '2024-07-04', paymentForMonth: 'July 2024', paymentMode: 'Bank Transfer', collectedById: 'U003' },
    { id: 'FP003', studentId: 'S003', studentName: 'Charlie Brown', registrationNumber: 'ICJA23001', campus: 'Jagadishpur', amount: 200, paymentDate: '2024-07-08', paymentForMonth: 'July 2024', paymentMode: 'Cash', collectedById: 'U001' },
];
let feePayments: FeePayment[] = [];
const loadFeePaymentsFromStorage = () => {
    try {
        const stored = localStorage.getItem(FEE_PAYMENTS_STORAGE_KEY);
        if (stored) {
            feePayments = JSON.parse(stored);
        } else {
            feePayments = initialFeePayments;
            saveFeePaymentsToStorage();
        }
    } catch (e) {
        console.error("Failed to load fee payments", e);
        feePayments = initialFeePayments;
    }
};
const saveFeePaymentsToStorage = () => {
    localStorage.setItem(FEE_PAYMENTS_STORAGE_KEY, JSON.stringify(feePayments));
};

// --- EXPENSES DATABASE ---
const initialExpenses: Expense[] = [
    { id: 'E001', category: 'Utilities', description: 'Electricity Bill', amount: 1500, expenseDate: '2024-07-02', campus: 'Brindabanpur', recordedById: 'U003' },
    { id: 'E002', category: 'Supplies', description: 'Office Stationery', amount: 300, expenseDate: '2024-07-05', campus: 'Brindabanpur', recordedById: 'U003' },
    { id: 'E003', category: 'Maintenance', description: 'Classroom Repair', amount: 800, expenseDate: '2024-07-10', campus: 'Jagadishpur', recordedById: 'U001' },
];
let expenses: Expense[] = [];
const loadExpensesFromStorage = () => {
    try {
        const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
        if (stored) {
            expenses = JSON.parse(stored);
        } else {
            expenses = initialExpenses;
            saveExpensesToStorage();
        }
    } catch (e) {
        console.error("Failed to load expenses", e);
        expenses = initialExpenses;
    }
};
const saveExpensesToStorage = () => {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
};


// --- LOAD ALL DATA ---
loadUsersFromStorage(); 
loadAnnouncementsFromStorage();
loadStudentsFromStorage();
loadTeachersFromStorage();
loadSyllabiFromStorage();
loadFeePaymentsFromStorage();
loadExpensesFromStorage();

const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 300));
};

// Auth
export const login = (credentials: LoginCredentials): Promise<User | null> => {
    const user = users.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.role === credentials.role &&
        u.campus === credentials.campus
    );

    if (user && user.passwordHash === credentials.password) {
        const { passwordHash, ...userToReturn } = user;
        return simulateDelay(userToReturn);
    }
    
    return simulateDelay(null);
};

export const signup = (details: SignupDetails): Promise<User | null> => {
    const userExists = users.some(u => u.email.toLowerCase() === details.email.toLowerCase());
    if (userExists) {
        return simulateDelay(null); // User already exists
    }
    const newUser: User & { passwordHash: string } = {
        id: `U${Date.now()}`,
        name: details.name,
        email: details.email,
        role: details.role,
        campus: details.campus,
        passwordHash: details.password,
        avatarUrl: undefined,
    };
    users.push(newUser);
    saveUsersToStorage();
    const { passwordHash, ...userToReturn } = newUser;
    return simulateDelay(userToReturn);
};

export const requestPasswordReset = (email: string): Promise<{ success: boolean }> => {
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!userExists) {
        // To prevent user enumeration, we return success even if the user doesn't exist.
        // The confirmation message will be generic ("If an account exists...").
        console.log(`Password reset requested for non-existent email: ${email}`);
    } else {
        console.log(`Simulating password reset email to ${email}. Demo reset code: 123456`);
    }
    return simulateDelay({ success: true });
};

export const resetPassword = (email: string, token: string, newPassword: string): Promise<{ success: boolean }> => {
    if (token !== '123456') {
        throw new Error("Invalid reset code.");
    }
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
        throw new Error("User not found. Ensure email is correct.");
    }

    users[userIndex].passwordHash = newPassword;
    saveUsersToStorage();
    
    return simulateDelay({ success: true });
};


// Data filtering logic
const filterByCampus = <T extends { campus: Campus | 'All' }>(data: T[], campus: Campus, role: Role) => {
    // Admins see all data from all campuses
    if (role === 'Admin') return [...data]; 
    return data.filter(item => item.campus === campus || item.campus === 'All');
};

// Students
export const getStudents = (campus: Campus, role: Role) => simulateDelay(filterByCampus(students, campus, role));
export const addStudent = (studentData: Omit<Student, 'id'>) => {
    // The registrationNumber is now expected to be provided in studentData from the form.
    const newStudent: Student = {
      ...studentData,
      id: `S${Date.now()}`,
    };
    students.push(newStudent);
    saveStudentsToStorage();
    return simulateDelay(newStudent);
};
export const updateStudent = (updatedStudent: Student) => {
    students = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    saveStudentsToStorage();
    return simulateDelay(updatedStudent);
};
export const deleteStudent = (studentId: string) => {
    students = students.filter(s => s.id !== studentId);
    saveStudentsToStorage();
    return simulateDelay({ success: true });
};

// Finds the highest registration number suffix for a given campus prefix for the current year.
const getNextRegNumSuffix = (prefix: string): number => {
    let maxSuffix = 0;
    const currentYearShort = new Date().getFullYear().toString().slice(-2); // e.g., '24' for 2024
    const fullPrefix = `${prefix}${currentYearShort}`; // e.g., ICBR24

    students.forEach(s => {
        if (s.registrationNumber.startsWith(fullPrefix)) {
            const suffix = parseInt(s.registrationNumber.substring(fullPrefix.length), 10);
            if (!isNaN(suffix) && suffix > maxSuffix) {
                maxSuffix = suffix;
            }
        }
    });
    return maxSuffix + 1;
};


export const addStudentsBatch = (studentsData: Omit<Student, 'id' | 'registrationNumber'>[]) => {
    let globalAddedCount = 0;

    // Use a map to get the next suffix for each campus to avoid recalculating every time
    const nextSuffixMap = new Map<Campus, number>();

    const newStudents: Student[] = studentsData.map(studentData => {
        const prefix = getCampusPrefix(studentData.campus); 
        
        if (!nextSuffixMap.has(studentData.campus)) {
            nextSuffixMap.set(studentData.campus, getNextRegNumSuffix(prefix));
        }

        const nextSuffix = nextSuffixMap.get(studentData.campus)!;
        const currentYearShort = new Date().getFullYear().toString().slice(-2);
        const registrationNumber = `${prefix}${currentYearShort}${String(nextSuffix).padStart(3, '0')}`; // e.g., ICBR24001
        
        nextSuffixMap.set(studentData.campus, nextSuffix + 1);

        const newStudent: Student = {
            ...studentData,
            id: `S${Date.now()}_${globalAddedCount++}`, // Ensure unique ID even in fast loops
            registrationNumber,
        };
        return newStudent;
    });

    students.push(...newStudents);
    saveStudentsToStorage();
    const addedCount = newStudents.length;

    return simulateDelay({ success: true, addedCount });
};


// Teachers
export const getTeachers = (campus: Campus, role: Role) => simulateDelay(filterByCampus(teachers, campus, role));
export const addTeacher = (teacher: Omit<Teacher, 'id' | 'avatarUrl'>) => {
    const newTeacher: Teacher = { 
        ...teacher, 
        id: `T${Date.now()}`,
        avatarUrl: `https://picsum.photos/seed/T${Date.now()}/200`
    };
    teachers.push(newTeacher);
    saveTeachersToStorage();
    return simulateDelay(newTeacher);
};
export const updateTeacher = (updatedTeacher: Teacher) => {
    teachers = teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t);
    saveTeachersToStorage();
    return simulateDelay(updatedTeacher);
};
export const deleteTeacher = (teacherId: string) => {
    teachers = teachers.filter(t => t.id !== teacherId);
    saveTeachersToStorage();
    return simulateDelay({ success: true });
};


// Syllabus
export const getSyllabi = (campus: Campus, role: Role) => simulateDelay(filterByCampus(syllabi, campus, role));

export const getSyllabiForTeacher = (teacherId: string) => {
    const teacherSyllabi = syllabi.filter(s => s.teacherId === teacherId);
    return simulateDelay(teacherSyllabi);
};

export const addSyllabus = (syllabusData: Omit<Syllabus, 'id' | 'teacherName'>) => {
    const teacher = teachers.find(t => t.id === syllabusData.teacherId);
    if (!teacher) throw new Error("Teacher not found");
    
    const newSyllabus: Syllabus = {
        ...syllabusData,
        id: `C${Date.now()}`,
        teacherName: teacher.name,
    };
    syllabi.push(newSyllabus);
    saveSyllabiToStorage();
    return simulateDelay(newSyllabus);
};

export const updateSyllabus = (updatedSyllabus: Syllabus) => {
    const teacher = teachers.find(t => t.id === updatedSyllabus.teacherId);
    if (!teacher) throw new Error("Teacher not found");
    
    // Ensure teacher name is updated if teacherId changes
    const fullUpdatedSyllabus = { ...updatedSyllabus, teacherName: teacher.name };

    syllabi = syllabi.map(s => s.id === fullUpdatedSyllabus.id ? fullUpdatedSyllabus : s);
    saveSyllabiToStorage();
    return simulateDelay(fullUpdatedSyllabus);
};

export const deleteSyllabus = (syllabusId: string) => {
    syllabi = syllabi.filter(s => s.id !== syllabusId);
    saveSyllabiToStorage();
    return simulateDelay({ success: true });
};


// Announcements
export const getAnnouncements = (campus: Campus, role: Role) => {
    const filtered = filterByCampus(announcements, campus, role);
    return simulateDelay(filtered);
};

export const addAnnouncement = (
    data: { title: string; content: string; campus: Campus | 'All'; isReminder: boolean },
    author: User
): Promise<Announcement> => {
    const newAnnouncement: Announcement = {
        id: `A${Date.now()}`,
        title: data.title,
        content: data.content,
        campus: data.campus,
        date: new Date().toISOString().split('T')[0],
        author: author.name,
    };
    announcements.unshift(newAnnouncement); // Add to the top
    saveAnnouncementsToStorage();

    if (data.isReminder) {
        const allReminders = getAllRemindersFromStorage();
        const reminderDueDate = new Date();
        // Set due date 1 minute from now to ensure it gets picked up
        reminderDueDate.setMinutes(reminderDueDate.getMinutes() + 1);

        const newReminder: Reminder = {
            id: `R${Date.now()}`,
            title: data.title,
            dueDateTime: reminderDueDate.toISOString(),
            isCompleted: false,
            isNotified: false,
            userId: author.id, // The ID of the admin who created it
        };
        allReminders.push(newReminder);
        saveAllRemindersToStorage(allReminders);
    }

    return simulateDelay(newAnnouncement);
};

// Dashboard Stats
export const getDashboardStats = (campus: Campus, role: Role) => {
    const campusStudents = filterByCampus(students, campus, role);
    const campusTeachers = filterByCampus(teachers, campus, role);
    const campusSyllabi = filterByCampus(syllabi, campus, role);
    const campusAnnouncements = filterByCampus(announcements, campus, role);

    return simulateDelay({
        studentCount: campusStudents.length,
        teacherCount: campusTeachers.length,
        syllabusCount: campusSyllabi.length,
        announcementCount: campusAnnouncements.length,
    });
};

// Accounts
export const getFeePayments = (campus: Campus, role: Role) => simulateDelay(filterByCampus(feePayments, campus, role));
export const addFeePayment = (paymentData: Omit<FeePayment, 'id' | 'studentName' | 'registrationNumber' | 'collectedById'>, collectedById: string) => {
    const student = students.find(s => s.id === paymentData.studentId);
    if (!student) throw new Error("Student not found");

    const newPayment: FeePayment = {
        ...paymentData,
        id: `FP${Date.now()}`,
        studentName: student.name,
        registrationNumber: student.registrationNumber,
        collectedById,
    };
    feePayments.push(newPayment);
    saveFeePaymentsToStorage();
    return simulateDelay(newPayment);
}

export const getExpenses = (campus: Campus, role: Role) => simulateDelay(filterByCampus(expenses, campus, role));
export const addExpense = (expenseData: Omit<Expense, 'id' | 'recordedById'>, recordedById: string) => {
    const newExpense: Expense = {
        ...expenseData,
        id: `E${Date.now()}`,
        recordedById,
    };
    expenses.push(newExpense);
    saveExpensesToStorage();
    return simulateDelay(newExpense);
}

export const getAccountSummary = (campus: Campus, role: Role, startDate: string, endDate: string) => {
    let relevantPayments = filterByCampus(feePayments, campus, role);
    let relevantExpenses = filterByCampus(expenses, campus, role);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const paymentsInRange = relevantPayments.filter(p => {
        const pDate = new Date(p.paymentDate);
        return pDate >= start && pDate <= end;
    });

    const expensesInRange = relevantExpenses.filter(e => {
        const eDate = new Date(e.expenseDate);
        return eDate >= start && eDate <= end;
    });

    const totalIncome = paymentsInRange.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = expensesInRange.reduce((sum, e) => sum + e.amount, 0);
    
    return simulateDelay({
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
    });
};

// --- REMINDERS ---
const getAllRemindersFromStorage = (): Reminder[] => {
    try {
        const stored = localStorage.getItem(REMINDERS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const saveAllRemindersToStorage = (reminders: Reminder[]) => {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
};

export const getReminders = (userId: string): Promise<Reminder[]> => {
    const allReminders = getAllRemindersFromStorage();
    const userReminders = allReminders.filter(r => r.userId === userId);
    return simulateDelay(userReminders);
};

export const getRemindersForNotification = (user: User): Promise<Reminder[]> => {
    const allReminders = getAllRemindersFromStorage();
    
    if (user.role === 'Admin') {
        // Admins only see their own reminder notifications
        return simulateDelay(allReminders.filter(r => r.userId === user.id));
    }
    
    if (user.role === 'Teacher' || user.role === 'Accountant') {
        // Teachers and Accountants see their own reminders + reminders from any Admin
        const adminIds = new Set(users.filter(u => u.role === 'Admin').map(u => u.id));
        const relevantReminders = allReminders.filter(r => {
            return r.userId === user.id || adminIds.has(r.userId);
        });
        return simulateDelay(relevantReminders);
    }
    
    // Default case (though should not be hit with current roles)
    return simulateDelay([]);
};


export const addReminder = (reminderData: Omit<Reminder, 'id' | 'isCompleted' | 'isNotified'>): Promise<Reminder> => {
    const allReminders = getAllRemindersFromStorage();
    const newReminder: Reminder = {
        ...reminderData,
        id: `R${Date.now()}`,
        isCompleted: false,
        isNotified: false,
    };
    allReminders.push(newReminder);
    saveAllRemindersToStorage(allReminders);
    return simulateDelay(newReminder);
};

export const updateReminder = (updatedReminder: Reminder): Promise<Reminder> => {
    let allReminders = getAllRemindersFromStorage();
    allReminders = allReminders.map(r => r.id === updatedReminder.id ? updatedReminder : r);
    saveAllRemindersToStorage(allReminders);
    return simulateDelay(updatedReminder);
};

export const deleteReminder = (reminderId: string): Promise<{ success: boolean }> => {
    let allReminders = getAllRemindersFromStorage();
    allReminders = allReminders.filter(r => r.id !== reminderId);
    saveAllRemindersToStorage(allReminders);
    return simulateDelay({ success: true });
};

// --- User Profile ---
export const updateUserProfile = (userId: string, updates: Partial<Pick<User, 'name' | 'avatarUrl'>>): Promise<User> => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error("User not found.");
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsersToStorage();

    const { passwordHash, ...userToReturn } = users[userIndex];
    return simulateDelay(userToReturn);
};

export const updateUserPassword = (userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error("User not found.");
    }
    
    if (users[userIndex].passwordHash !== oldPassword) {
        throw new Error("Incorrect current password.");
    }

    users[userIndex].passwordHash = newPassword;
    saveUsersToStorage();
    
    return simulateDelay({ success: true });
};