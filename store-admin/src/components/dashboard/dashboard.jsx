import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../component/layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [adminUsers, setAdminUsers] = useState([]);
    const [regularUsers, setRegularUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Calculate statistics from actual data
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalCustomers = regularUsers.length + adminUsers.length;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    // Process orders for charts
    const processOrdersByDay = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            return date.toDateString();
        }).reverse();

        const dailyData = last7Days.map(dateStr => {
            const dayOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt).toDateString();
                return orderDate === dateStr;
            });

            const dayName = days[new Date(dateStr).getDay()];
            const dailySales = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            return {
                name: dayName,
                sales: dailySales,
                orders: dayOrders.length
            };
        });

        return dailyData;
    };

    // Get top products from orders
    const getTopProducts = () => {
        const productMap = new Map();

        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const productName = item.productName;
                    if (productMap.has(productName)) {
                        const existing = productMap.get(productName);
                        existing.sales += item.quantity || 1;
                        existing.revenue += item.subtotal || 0;
                    } else {
                        productMap.set(productName, {
                            name: productName,
                            sales: item.quantity || 1,
                            revenue: item.subtotal || 0
                        });
                    }
                });
            }
        });

        // Sort by revenue and take top 4
        return Array.from(productMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 4)
            .map(product => ({
                ...product,
                revenue: `KSh ${product.revenue.toLocaleString()}`
            }));
    };

    // Get recent orders (last 5)
    const getRecentOrders = () => {
        return [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(order => ({
                id: `#ORD-${order.id}`,
                customer: order.userName || order.shippingFullName,
                amount: `KSh ${order.totalAmount?.toLocaleString() || 0}`,
                status: order.status?.toLowerCase() || 'pending',
                time: getTimeAgo(order.createdAt),
                originalOrder: order
            }));
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getAdminUsers = async () => {
        try {
            const response = await api.get("/auth/users/admins");
            setAdminUsers(response.data.admins || []);
        } catch (error) {
            toast.error("Failed to load admin users. Please try again.");
        }
    };

    const getRegularUsers = async () => {
        try {
            const response = await api.get("/auth/users/regular");
            setRegularUsers(response.data.users || []);
        } catch (error) {
            toast.error("Failed to load regular users. Please try again.");
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            setOrders(response.data || []);
        } catch (error) {
            toast.error('Failed to load orders');
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                getAdminUsers(),
                getRegularUsers(),
                fetchOrders()
            ]);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const salesData = processOrdersByDay();
    const topProducts = getTopProducts();
    const recentOrders = getRecentOrders();

    if (loading) {
        return (
            <Layout>
                <div className="flex-1 flex items-center justify-center mt-16">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex-1 flex flex-col transition-all duration-300">
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
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                                <p className="text-2xl font-bold text-gray-900">KSh {totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">From {totalOrders} orders</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                                <p className="text-xs text-gray-500 mt-2">Across all products</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Customers</h3>
                                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                                <p className="text-xs text-gray-500 mt-2">{adminUsers.length} Admins, {regularUsers.length} Users</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Avg Order Value</h3>
                                <p className="text-2xl font-bold text-gray-900">KSh {avgOrderValue}</p>
                                <p className="text-xs text-gray-500 mt-2">Per order average</p>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Sales Chart */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Sales Overview (Last 7 Days)</h2>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                            <span className="text-gray-600">Sales (KSh)</span>
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
                                        <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
                                        <Tooltip />
                                        <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Top Products */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
                                <div className="space-y-4">
                                    {topProducts.length > 0 ? (
                                        topProducts.map((product, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No products sold yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                    <button  onClick={() => navigate("/orders")} className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {recentOrders.length > 0 ? (
                                            recentOrders.map((order, idx) => (
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
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    No orders found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;