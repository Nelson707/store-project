import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from "../../components/layout/layout";
import api from "../../api/axios";
import { toastify } from "../../utils/toast";
import {
    Package,
    CheckCircle,
    XCircle,
    Truck,
    MapPin,
    Calendar,
    ChevronRight,
    Search,
    Timer,
    ShoppingBag,
    PackageCheck,
    PackageSearch,
} from 'lucide-react'

const PAYMENT_LABELS = {
    CASH_ON_DELIVERY: "Cash on Delivery",
    MPESA: "M-Pesa",
    CREDIT_CARD: "Credit / Debit Card",
    BANK_TRANSFER: "Bank Transfer",
};

const Orders = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showOrderDetails, setShowOrderDetails] = useState(false)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await api.get("/orders");
            if (response.status === 200) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error(error);
            toastify("Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const orderIdStr = `ORD-${String(order.id).padStart(3, '0')}`
        const matchesSearch =
            orderIdStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            order.shippingFullName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter

        let matchesDate = true
        if (dateFilter !== 'all') {
            const orderDate = new Date(order.createdAt)
            const today = new Date()
            const diffDays = Math.ceil(Math.abs(today - orderDate) / (1000 * 60 * 60 * 24))
            if (dateFilter === 'last7') matchesDate = diffDays <= 7
            else if (dateFilter === 'last30') matchesDate = diffDays <= 30
            else if (dateFilter === 'last90') matchesDate = diffDays <= 90
        }

        return matchesSearch && matchesStatus && matchesDate
    })

    const getStatusBadge = (status) => {
        const statusConfig = {
            DELIVERED: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4 mr-1" />, label: 'Delivered' },
            SHIPPED: { color: 'bg-blue-100 text-blue-800', icon: <Truck className="h-4 w-4 mr-1" />, label: 'Shipped' },
            PROCESSING: { color: 'bg-yellow-100 text-yellow-800', icon: <Timer className="h-4 w-4 mr-1" />, label: 'Processing' },
            CONFIRMED: { color: 'bg-indigo-100 text-indigo-800', icon: <CheckCircle className="h-4 w-4 mr-1" />, label: 'Confirmed' },
            PENDING: { color: 'bg-gray-100 text-gray-800', icon: <Timer className="h-4 w-4 mr-1" />, label: 'Pending' },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4 mr-1" />, label: 'Cancelled' },
        }
        const config = statusConfig[status] || statusConfig.PENDING
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                {config.label}
            </span>
        )
    }

    const formatKES = (amount) =>
        `KES ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric', month: 'short', day: 'numeric'
        })

    const viewOrderDetails = (order) => {
        setSelectedOrder(order)
        setShowOrderDetails(true)
    }

    return (
        <Layout title="My Orders" subtitle="Track and manage your orders">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600 mt-1">View and track all your orders in one place</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs text-gray-500">Total Orders</p>
                                <p className="text-lg font-semibold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-2">
                                <PackageCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs text-gray-500">Delivered</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {orders.filter(o => o.status === 'DELIVERED').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-2">
                                <PackageSearch className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs text-gray-500">In Progress</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {orders.filter(o => ['PROCESSING', 'SHIPPED', 'PENDING', 'CONFIRMED'].includes(o.status)).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-2">
                                <ShoppingBag className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs text-gray-500">Total Spent</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatKES(orders.reduce((sum, o) => sum + Number(o.totalAmount), 0))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by order ID, product name, or customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white text-gray-900"
                            >
                                <option value="all">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white text-gray-900"
                            >
                                <option value="all">All Time</option>
                                <option value="last7">Last 7 Days</option>
                                <option value="last30">Last 30 Days</option>
                                <option value="last90">Last 90 Days</option>
                            </select>
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateFilter('all') }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : "You haven't placed any orders yet"}
                        </p>
                        {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
                            <button
                                onClick={() => navigate('/products')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Start Shopping
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200 bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Order Number</p>
                                                <p className="text-base font-semibold text-gray-900">
                                                    ORD-{String(order.id).padStart(3, '0')}
                                                </p>
                                            </div>
                                            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
                                            <div>
                                                <p className="text-sm text-gray-500">Placed on</p>
                                                <p className="text-sm text-gray-900 flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(order.status)}
                                            <button
                                                onClick={() => viewOrderDetails(order)}
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                View Details
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                            <span className="text-sm text-gray-500">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatKES(order.totalAmount)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                • {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Previews */}
                                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex-shrink-0 flex items-center space-x-2">
                                                <div className="h-10 w-10 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={`http://localhost:8080/images/${item.productImageFileName}`}
                                                        alt={item.productName}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => { e.target.src = '/placeholder.png' }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-900 truncate max-w-[120px]">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {item.quantity} • {formatKES(item.unitPrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex-shrink-0 text-sm text-gray-500">
                                                +{order.items.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                                    <button
                                        onClick={() => setShowOrderDetails(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <XCircle className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Order Meta */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Order Number</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ORD-{String(selectedOrder.id).padStart(3, '0')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Order Date</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDate(selectedOrder.createdAt)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Status</p>
                                                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Method</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {PAYMENT_LABELS[selectedOrder.paymentMethod] ?? selectedOrder.paymentMethod}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Status</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedOrder.paymentStatus}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Customer</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedOrder.userName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                                                    <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={`http://localhost:8080/images/${item.productImageFileName}`}
                                                            alt={item.productName}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => { e.target.src = '/placeholder.png' }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatKES(item.unitPrice)} × {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatKES(item.subtotal)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                            Shipping Address
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {selectedOrder.shippingFullName}<br />
                                            {selectedOrder.shippingPhone}<br />
                                            {selectedOrder.shippingAddress}<br />
                                            {selectedOrder.shippingCity}, {selectedOrder.shippingCounty}
                                        </p>
                                        {selectedOrder.orderNotes && (
                                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-xs text-yellow-700">
                                                    <span className="font-semibold">Note: </span>
                                                    {selectedOrder.orderNotes}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-gray-600">Shipping</span>
                                            <span className="text-sm font-medium text-gray-900">Free</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-base font-medium text-gray-900">Total</span>
                                            <span className="text-base font-bold text-blue-600">
                                                {formatKES(selectedOrder.totalAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => { setShowOrderDetails(false); navigate('/products') }}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            Shop Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Orders