import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout, updateUser } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch profile data when component mounts and user is authenticated
  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (isAuthenticated && user) {
        console.log('Header: Fetching profile data...');
        try {
          const profileResponse = await authService.getProfile();
          console.log('Header: Profile response received', { avatarUrl: profileResponse.data?.avatarUrl });

          if (profileResponse.success && profileResponse.data) {
            // Update Redux state with fresh profile data including avatar
            dispatch(updateUser(profileResponse.data));
            console.log('Header: Redux updated with profile data');
          }
        } catch (error) {
          console.error('Failed to fetch profile for header:', error);
        }
      }
    };

    fetchProfileData();
  }, [isAuthenticated, dispatch]); // Only fetch when authentication status changes


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back, {user?.username}!
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                {(user?.avatarUrl || (user as any)?.profileImage) ? (
                  <img
                    src={user?.avatarUrl || (user as any)?.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      console.log('Header avatar failed to load:', user?.avatarUrl || (user as any)?.profileImage);
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center ${(user?.avatarUrl || (user as any)?.profileImage) ? 'hidden' : ''}`}>
                  <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block">{user?.username}</span>
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <span className="text-xs text-gray-400">
                    avatarUrl: {user?.avatarUrl ? '✓' : '✗'} | profileImage: {(user as any)?.profileImage ? '✓' : '✗'}
                  </span>
                )}
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;