import React from 'react';

const Header = ({ title = 'Dashboard', subtitle = 'Welcome back! Here\'s what\'s happening today.', timeRange, onTimeRangeChange, sidebarCollapsed }) => {
    return (
        <header
            className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 z-20"
            style={{ marginLeft: sidebarCollapsed ? '5rem' : '16rem' }}
        >
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => onTimeRangeChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;