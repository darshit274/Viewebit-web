import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout, updateUser } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  CameraIcon,
  TrophyIcon,
  BookOpenIcon,
  ClockIcon,
  ViewfinderCircleIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface UserStats {
  testsCompleted: number;
  totalScore: number;
  averageScore: number;
  rank: number;
  studyHours: number;
  streak: number;
}

interface Achievement {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  unlocked: boolean;
}

interface MenuItem {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  route?: string;
  description: string;
}

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isUpdating, setIsUpdating] = useState(false);
  // Removed unused state variables
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    testsCompleted: 0,
    totalScore: 0,
    averageScore: 0,
    rank: 0,
    studyHours: 0,
    streak: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setUserProfile(response.data);
          if (response.data.stats) {
            setUserStats(response.data.stats);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  // Remove achievements for now

  // Removed unused handler functions

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Account Settings',
      icon: UserIcon,
      route: '/profile/edit',
      description: 'Manage your personal information',
    },
    {
      id: 2,
      title: 'Downloaded PDFs',
      icon: ArrowDownTrayIcon,
      route: '/downloads',
      description: 'Manage your downloaded content',
    },
    {
      id: 3,
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      route: '/privacy',
      description: 'Privacy settings and security',
    },
    {
      id: 4,
      title: 'Help & Support',
      icon: QuestionMarkCircleIcon,
      route: '/help',
      description: 'Get help and contact support',
    },
  ];

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await authService.uploadAvatar(formData);

      if (response.success) {
        setUserProfile(response.data);
        dispatch(updateUser(response.data));
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload profile picture';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear Redux state
        dispatch(logout());
        
        toast.success('Logged out successfully');
        navigate('/auth/login');
      } catch (error) {
        console.error('Error during logout:', error);
        toast.error('Failed to logout. Please try again.');
      }
    }
  };

  const formatMemberSince = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-400 to-primary-600 text-white">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden border-3 border-white">
                  {userProfile?.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.fullName || userProfile.username}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-white" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white text-primary-600 rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-colors"
                  disabled={isUpdating}
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white">
                  {userProfile?.fullName || userProfile?.username || user?.username || 'Student'}
                </h1>
                <p className="text-white text-opacity-90 text-sm">
                  {userProfile?.email || user?.email || ''}
                </p>
                <p className="text-white text-opacity-70 text-xs">
                  Member since {userProfile?.created_at ? 
                    formatMemberSince(userProfile.created_at) 
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate('/profile/edit')}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            >
              <PencilIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col items-center text-center">
              <BookOpenIcon className="w-6 h-6 text-primary-500 mb-2" />
              <p className="text-lg font-bold text-gray-900">{userStats.testsCompleted}</p>
              <p className="text-xs text-gray-600">Tests Completed</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col items-center text-center">
              <TrophyIcon className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-lg font-bold text-gray-900">#{userStats.rank}</p>
              <p className="text-xs text-gray-600">Current Rank</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col items-center text-center">
              <ViewfinderCircleIcon className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-lg font-bold text-gray-900">{userStats.averageScore}%</p>
              <p className="text-xs text-gray-600">Average Score</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col items-center text-center">
              <ClockIcon className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-lg font-bold text-gray-900">{userStats.studyHours}h</p>
              <p className="text-xs text-gray-600">Study Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements section removed for now */}

      {/* Quick Actions */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="bg-white rounded-lg shadow-sm border">
          <button
            onClick={() => navigate('/test-history')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Test History</p>
                <p className="text-sm text-gray-500">View your past test performance</p>
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <div className="bg-white rounded-lg shadow-sm border divide-y divide-gray-100">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuPress(item)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 py-4">
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 rounded-lg p-4 flex items-center justify-center space-x-2 hover:bg-red-50 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-600" />
          <span className="font-medium text-red-600">Logout</span>
        </button>
      </div>

      {/* App Version */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-gray-400">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default ProfilePage;