import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

const Layout = ({ children, title, subtitle }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <Header 
          title={title}
          subtitle={subtitle}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <div className="flex-1 overflow-y-auto mt-16">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;