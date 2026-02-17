import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layout/layout'
import api from '../../api/axios'
import { toastify } from '../../utils/toast'
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Home,
    MapPin,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    Download,
    Eye,
    RefreshCw,
    CreditCard,
    ShoppingBag,
    AlertCircle,
    PackageCheck,
    PackageSearch,
    PackageX,
    Timer
} from 'lucide-react'

const Orders = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showOrderDetails, setShowOrderDetails] = useState(false)

    // Mock data - replace with actual API call
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            try {
                // Replace with your actual API endpoint
                // const response = await api.get('/orders')
                // setOrders(response.data)

                // Mock data for demonstration
                setTimeout(() => {
                    const mockOrders = [
                        {
                            id: 'ORD-001',
                            orderNumber: 'ORD-2024-001',
                            date: '2024-03-15T10:30:00',
                            status: 'delivered',
                            total: 12500,
                            items: 3,
                            paymentMethod: 'M-Pesa',
                            trackingNumber: 'TRK123456789',
                            estimatedDelivery: '2024-03-18',
                            shippingAddress: {
                                street: '123 Main Street',
                                city: 'Nairobi',
                                state: 'Nairobi',
                                zipCode: '00100',
                                country: 'Kenya'
                            },
                            products: [
                                {
                                    id: 1,
                                    name: 'iPhone 13 Pro',
                                    quantity: 1,
                                    price: 85000,
                                    image: 'iphone13.jpg'
                                },
                                {
                                    id: 2,
                                    name: 'AirPods Pro',
                                    quantity: 1,
                                    price: 25000,
                                    image: 'airpods.jpg'
                                }
                            ]
                        },
                        {
                            id: 'ORD-002',
                            orderNumber: 'ORD-2024-002',
                            date: '2024-03-14T14:45:00',
                            status: 'shipped',
                            total: 34500,
                            items: 2,
                            paymentMethod: 'Card',
                            trackingNumber: 'TRK987654321',
                            estimatedDelivery: '2024-03-19',
                            shippingAddress: {
                                street: '456 Kenyatta Avenue',
                                city: 'Mombasa',
                                state: 'Mombasa',
                                zipCode: '80100',
                                country: 'Kenya'
                            },
                            products: [
                                {
                                    id: 3,
                                    name: 'Samsung Galaxy S23',
                                    quantity: 1,
                                    price: 32000,
                                    image: 'samsung.jpg'
                                },
                                {
                                    id: 4,
                                    name: 'Samsung Watch',
                                    quantity: 1,
                                    price: 2500,
                                    image: 'watch.jpg'
                                }
                            ]
                        },
                        {
                            id: 'ORD-003',
                            orderNumber: 'ORD-2024-003',
                            date: '2024-03-13T09:15:00',
                            status: 'processing',
                            total: 8900,
                            items: 4,
                            paymentMethod: 'M-Pesa',
                            trackingNumber: null,
                            estimatedDelivery: '2024-03-20',
                            shippingAddress: {
                                street: '789 Oginga Odinga Street',
                                city: 'Kisumu',
                                state: 'Kisumu',
                                zipCode: '40100',
                                country: 'Kenya'
                            },
                            products: [
                                {
                                    id: 5,
                                    name: 'Wireless Headphones',
                                    quantity: 2,
                                    price: 3000,
                                    image: 'headphones.jpg'
                                },
                                {
                                    id: 6,
                                    name: 'Phone Case',
                                    quantity: 2,
                                    price: 1450,
                                    image: 'case.jpg'
                                }
                            ]
                        },
                        {
                            id: 'ORD-004',
                            orderNumber: 'ORD-2024-004',
                            date: '2024-03-10T16:20:00',
                            status: 'cancelled',
                            total: 15750,
                            items: 1,
                            paymentMethod: 'Card',
                            trackingNumber: null,
                            estimatedDelivery: null,
                            shippingAddress: {
                                street: '321 Moi Avenue',
                                city: 'Nakuru',
                                state: 'Nakuru',
                                zipCode: '20100',
                                country: 'Kenya'
                            },
                            products: [
                                {
                                    id: 7,
                                    name: 'iPad Air',
                                    quantity: 1,
                                    price: 15750,
                                    image: 'ipad.jpg'
                                }
                            ]
                        }
                    ]
                    setOrders(mockOrders)
                    setLoading(false)
                }, 1000)
            } catch (error) {
                console.error('Failed to fetch orders:', error)
                toastify('Failed to load orders', 'error')
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter

        let matchesDate = true
        if (dateFilter !== 'all') {
            const orderDate = new Date(order.date)
            const today = new Date()
            const diffTime = Math.abs(today - orderDate)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (dateFilter === 'last7') matchesDate = diffDays <= 7
            else if (dateFilter === 'last30') matchesDate = diffDays <= 30
            else if (dateFilter === 'last90') matchesDate = diffDays <= 90
        }

        return matchesSearch && matchesStatus && matchesDate
    })

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            delivered: {
                color: 'bg-green-100 text-green-800',
                icon: <CheckCircle className="h-4 w-4 mr-1" />,
                label: 'Delivered'
            },
            shipped: {
                color: 'bg-blue-100 text-blue-800',
                icon: <Truck className="h-4 w-4 mr-1" />,
                label: 'Shipped'
            },
            processing: {
                color: 'bg-yellow-100 text-yellow-800',
                icon: <Timer className="h-4 w-4 mr-1" />,
                label: 'Processing'
            },
            cancelled: {
                color: 'bg-red-100 text-red-800',
                icon: <XCircle className="h-4 w-4 mr-1" />,
                label: 'Cancelled'
            }
        }
        const config = statusConfig[status] || statusConfig.processing
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                {config.label}
            </span>
        )
    }

    // Format currency
    const formatKES = (amount) => {
        return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
    }

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    // View order details
    const viewOrderDetails = (order) => {
        setSelectedOrder(order)
        setShowOrderDetails(true)
    }

    // Track order
    const trackOrder = (order) => {
        if (order.trackingNumber) {
            navigate(`/track-order/${order.trackingNumber}`)
        } else {
            toastify('Tracking number not available yet', 'info')
        }
    }

    return (
        <Layout title="My Orders" subtitle="Track and manage your orders">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Stats */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600 mt-1">View and track all your orders in one place</p>
                </div>

                {/* Order Stats Cards */}
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
                                    {orders.filter(o => o.status === 'delivered').length}
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
                                    {orders.filter(o => ['processing', 'shipped'].includes(o.status)).length}
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
                                    {formatKES(orders.reduce((sum, o) => sum + o.total, 0))}
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
                                placeholder="Search by order number, product, or tracking..."
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
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
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
                                onClick={() => {
                                    setSearchTerm('')
                                    setStatusFilter('all')
                                    setDateFilter('all')
                                }}
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
                                                <p className="text-base font-semibold text-gray-900">{order.orderNumber}</p>
                                            </div>
                                            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
                                            <div>
                                                <p className="text-sm text-gray-500">Placed on</p>
                                                <p className="text-sm text-gray-900 flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                    {formatDate(order.date)}
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

                                {/* Order Items Preview */}
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                            <span className="text-sm text-gray-500">
                                                {order.items} item{order.items > 1 ? 's' : ''}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatKES(order.total)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                • {order.paymentMethod}
                                            </span>
                                        </div>
                                        {order.trackingNumber && (
                                            <button
                                                onClick={() => trackOrder(order)}
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                <Truck className="h-4 w-4 mr-1" />
                                                Track Order
                                            </button>
                                        )}
                                    </div>

                                    {/* Product Previews */}
                                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                                        {order.products.slice(0, 3).map((product) => (
                                            <div key={product.id} className="flex-shrink-0 flex items-center space-x-2">
                                                <div className="h-10 w-10 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={`http://localhost:8080/images/${product.image}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder.png'
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-900 truncate max-w-[120px]">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {product.quantity} • {formatKES(product.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.products.length > 3 && (
                                            <div className="flex-shrink-0 text-sm text-gray-500">
                                                +{order.products.length - 3} more
                                            </div>
                                        )}
                                    </div>

                                    {/* Delivery Info */}
                                    {order.estimatedDelivery && (
                                        <div className="mt-4 flex items-center text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                                            <Truck className="h-4 w-4 text-blue-500 mr-2" />
                                            <span>
                                                Estimated delivery by <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                                            </span>
                                        </div>
                                    )}
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

                                {/* Order Info */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Order Number</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedOrder.orderNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Order Date</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDate(selectedOrder.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Status</p>
                                                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Method</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedOrder.paymentMethod}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                                        <div className="space-y-3">
                                            {selectedOrder.products.map((product) => (
                                                <div key={product.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                                                    <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={`http://localhost:8080/images/${product.image}`}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder.png'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500">Quantity: {product.quantity}</p>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">{formatKES(product.price * product.quantity)}</p>
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
                                            {selectedOrder.shippingAddress.street}<br />
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                                            {selectedOrder.shippingAddress.zipCode}<br />
                                            {selectedOrder.shippingAddress.country}
                                        </p>
                                    </div>

                                    {/* Tracking Info */}
                                    {selectedOrder.trackingNumber && (
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                                <Truck className="h-4 w-4 mr-1 text-blue-500" />
                                                Tracking Information
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Tracking Number: <span className="font-medium">{selectedOrder.trackingNumber}</span>
                                            </p>
                                            {selectedOrder.estimatedDelivery && (
                                                <p className="text-sm text-gray-600">
                                                    Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Order Summary */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-gray-600">Subtotal</span>
                                            <span className="text-sm font-medium text-gray-900">{formatKES(selectedOrder.total)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-gray-600">Shipping</span>
                                            <span className="text-sm font-medium text-gray-900">Free</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-base font-medium text-gray-900">Total</span>
                                            <span className="text-base font-bold text-blue-600">{formatKES(selectedOrder.total)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        {selectedOrder.trackingNumber && (
                                            <button
                                                onClick={() => {
                                                    setShowOrderDetails(false)
                                                    trackOrder(selectedOrder)
                                                }}
                                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                <Truck className="h-4 w-4 mr-2" />
                                                Track Order
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setShowOrderDetails(false)
                                                navigate('/products')
                                            }}
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