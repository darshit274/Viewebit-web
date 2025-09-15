import React from 'react';
import { Outlet } from 'react-router-dom';
import ModernSidebar from './ModernSidebar';

const MainLayout: React.FC = () => {
  return (
    <ModernSidebar>
      <div className="p-6">
        <Outlet />
      </div>
    </ModernSidebar>
  );
};

export default MainLayout;