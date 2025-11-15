import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { getDashboardStats, getSyllabiForTeacher } from '../services/mockApiService';
import { StudentsIcon, TeachersIcon, SyllabusIcon, AnnouncementsIcon } from '../constants';
import { User, Syllabus } from '../types';

interface Stats {
  studentCount: number;
  teacherCount: number;
  syllabusCount: number;
  announcementCount: number;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [mySyllabi, setMySyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const statsPromise = getDashboardStats(user.campus, user.role);
      
      if (user.role === 'Teacher') {
        const syllabiPromise = getSyllabiForTeacher(user.id);
        const [statsData, syllabiData] = await Promise.all([statsPromise, syllabiPromise]);
        setStats(statsData);
        setMySyllabi(syllabiData.sort((a, b) => a.week.localeCompare(b.week, undefined, { numeric: true })));
      } else {
        const statsData = await statsPromise;
        setStats(statsData);
      }

      setLoading(false);
    };
    fetchAllData();
  }, [user]);

  if (loading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Students"
          value={stats?.studentCount || 0}
          icon={<StudentsIcon className="h-8 w-8 text-white" />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Total Teachers"
          value={stats?.teacherCount || 0}
          icon={<TeachersIcon className="h-8 w-8 text-white" />}
          color="bg-green-500"
        />
        <DashboardCard
          title="Total Syllabi"
          value={stats?.syllabusCount || 0}
          icon={<SyllabusIcon className="h-8 w-8 text-white" />}
          color="bg-purple-500"
        />
        <DashboardCard
          title="Announcements"
          value={stats?.announcementCount || 0}
          icon={<AnnouncementsIcon className="h-8 w-8 text-white" />}
          color="bg-yellow-500"
        />
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">ICA Management Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-400">
              You are currently viewing the dashboard for <strong>{user.campus} Campus</strong>. Use the navigation on the left to manage different aspects of the school.
          </p>
      </div>

      {user.role === 'Teacher' && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                 <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">My Weekly Syllabus</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Week</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Syllabus Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {mySyllabi.length > 0 ? (
                            mySyllabi.map(syllabus => (
                                <tr key={syllabus.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{syllabus.week}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{syllabus.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{syllabus.subject}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-300 max-w-sm">{syllabus.description}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    You have no syllabi assigned for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;