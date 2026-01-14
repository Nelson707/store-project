import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../component/sidebar';
import Header from '../component/header';

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('week');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Sample data
    const salesData = [
        { name: 'Mon', sales: 4200, orders: 24 },
        { name: 'Tue', sales: 3800, orders: 18 },
        { name: 'Wed', sales: 5200, orders: 32 },
        { name: 'Thu', sales: 4600, orders: 28 },
        { name: 'Fri', sales: 6100, orders: 38 },
        { name: 'Sat', sales: 7200, orders: 45 },
        { name: 'Sun', sales: 5800, orders: 35 }
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'John Doe', amount: '$245.00', status: 'completed', time: '2 min ago' },
        { id: '#ORD-002', customer: 'Sarah Smith', amount: '$128.50', status: 'pending', time: '15 min ago' },
        { id: '#ORD-003', customer: 'Mike Johnson', amount: '$392.00', status: 'processing', time: '1 hour ago' },
        { id: '#ORD-004', customer: 'Emma Wilson', amount: '$156.75', status: 'completed', time: '2 hours ago' }
    ];

    const topProducts = [
        { name: 'Wireless Headphones', sales: 245, revenue: '$12,250' },
        { name: 'Smart Watch Pro', sales: 189, revenue: '$37,800' },
        { name: 'Laptop Stand', sales: 156, revenue: '$4,680' },
        { name: 'USB-C Cable', sales: 423, revenue: '$8,460' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar Component */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
                {/* Header Component */}
                <Header
                    title="Dashboard"
                    subtitle="Welcome back! Here's what's happening today."
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    sidebarCollapsed={sidebarCollapsed}
                />

                <div className="flex-1 overflow-y-auto mt-16">
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                                <p className="text-2xl font-bold text-gray-900">$45,231</p>
                                <p className="text-xs text-gray-500 mt-2">vs last week</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+8.2%</span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                                <p className="text-2xl font-bold text-gray-900">1,847</p>
                                <p className="text-xs text-gray-500 mt-2">vs last week</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+15.3%</span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">New Customers</h3>
                                <p className="text-2xl font-bold text-gray-900">423</p>
                                <p className="text-xs text-gray-500 mt-2">vs last week</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-2.4%</span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Avg Order Value</h3>
                                <p className="text-2xl font-bold text-gray-900">$24.50</p>
                                <p className="text-xs text-gray-500 mt-2">vs last week</p>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Sales Chart */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                            <span className="text-gray-600">Sales</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                                            <span className="text-gray-600">Orders</span>
                                        </div>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                        <Line type="monotone" dataKey="orders" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Top Products */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
                                <div className="space-y-4">
                                    {topProducts.map((product, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.sales} sales</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {recentOrders.map((order, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;