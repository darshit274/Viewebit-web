import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

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
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center ${user?.avatarUrl ? 'hidden' : ''}`}>
                  <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block">{user?.username}</span>
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