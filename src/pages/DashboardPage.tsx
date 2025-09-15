import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  UserGroupIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalTests: number;
  completedTests: number;
  totalPdfs: number;
  downloadedPdfs: number;
  rank: number;
  totalStudents: number;
  recentActivity: {
    id: number;
    type: 'test' | 'pdf';
    title: string;
    date: string;
    score?: number;
  }[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats>({
    totalTests: 0,
    completedTests: 0,
    totalPdfs: 0,
    downloadedPdfs: 0,
    rank: 0,
    totalStudents: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(7);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="loading-spinner w-12 h-12 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {user?.username}!
              </h1>
              <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                <FireIcon className="w-4 h-4 mr-1" />
                {streak} day streak
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Ready to continue your learning journey? Let's achieve your goals today.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-500">Current time</p>
              <p className="text-lg font-semibold text-gray-900">{formatTime(currentTime)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/tests" className="btn btn-primary">
                <PlayIcon className="w-4 h-4 mr-2" />
                Start Test
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tests */}
        <div className="card p-6 group hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <AcademicCapIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              <p className="text-sm text-gray-500">Total Tests</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Available to take</p>
            <Link to="/tests" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all <ArrowRightIcon className="w-3 h-3 inline ml-1" />
            </Link>
          </div>
        </div>

        {/* Completed Tests */}
        <div className="card p-6 group hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
              <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{stats.completedTests}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.totalTests > 0 ? (stats.completedTests / stats.totalTests) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {stats.totalTests > 0 ? Math.round((stats.completedTests / stats.totalTests) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Your Rank */}
        <div className="card p-6 group hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
              <TrophyIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {stats.rank ? `#${stats.rank}` : '-'}
              </p>
              <p className="text-sm text-gray-500">Your Rank</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">of {stats.totalStudents} students</p>
            <div className="flex items-center text-emerald-600 text-sm">
              <ArrowUpIcon className="w-3 h-3 mr-1" />
              <span>Rising</span>
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="card p-6 group hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <DocumentTextIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{stats.totalPdfs}</p>
              <p className="text-sm text-gray-500">PDFs Available</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{stats.downloadedPdfs} downloaded</p>
            <Link to="/pdfs" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Browse <ArrowRightIcon className="w-3 h-3 inline ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <CalendarIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {stats.recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-500 mb-6">Start taking tests to see your progress here</p>
                  <Link to="/tests" className="btn btn-primary">
                    Take Your First Test
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'test' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'test' ? (
                          <AcademicCapIcon className={`w-5 h-5 ${
                            activity.type === 'test' ? 'text-blue-600' : 'text-purple-600'
                          }`} />
                        ) : (
                          <DocumentTextIcon className={`w-5 h-5 ${
                            activity.type === 'test' ? 'text-blue-600' : 'text-purple-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {activity.score !== undefined && (
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            activity.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                            activity.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            <StarIcon className="w-3 h-3 mr-1" />
                            {activity.score}%
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Study Streak */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Study Streak</h3>
              <div className="p-2 bg-orange-100 rounded-lg">
                <FireIcon className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">{streak}</p>
              <p className="text-sm text-gray-500 mb-4">days in a row</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(streak / 30) * 100}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Keep it up! Goal: 30 days</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/tests"
                className="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200">
                  <PlayIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Take a Test</p>
                  <p className="text-sm text-gray-500">Start practicing now</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>

              <Link
                to="/pdfs"
                className="flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200">
                  <BookOpenIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Study Materials</p>
                  <p className="text-sm text-gray-500">Browse resources</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>

              <Link
                to="/profile/performance"
                className="flex items-center p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors group"
              >
                <div className="p-2 bg-emerald-100 rounded-lg mr-3 group-hover:bg-emerald-200">
                  <ChartBarIcon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">View Performance</p>
                  <p className="text-sm text-gray-500">Track your progress</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;