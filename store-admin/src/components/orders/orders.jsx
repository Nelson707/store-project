import React, { useState, useEffect } from 'react'
import Layout from '../component/layout'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  RefreshCw,
  ChevronDown,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Package,
} from 'lucide-react'

const PAYMENT_LABELS = {
  CASH_ON_DELIVERY: 'Cash on Delivery',
  MPESA: 'M-Pesa',
  CREDIT_CARD: 'Credit / Debit Card',
  BANK_TRANSFER: 'Bank Transfer',
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // ── Fetch all orders ─────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  // ── Update order status ──────────────────────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? response.data : o))
      if (selectedOrder?.id === orderId) setSelectedOrder(response.data)
      toast.s('Order status updated')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  // ── Stats derived from real data ─────────────────────────────────────────────
  const stats = [
    { name: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-500' },
    { name: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: 'bg-yellow-500' },
    { name: 'Processing', value: orders.filter(o => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length, icon: RefreshCw, color: 'bg-purple-500' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'CANCELLED').length, icon: XCircle, color: 'bg-red-500' },
  ]

  // ── Filters ──────────────────────────────────────────────────────────────────
  const filters = ['all', ...ORDER_STATUSES.map(s => s.toLowerCase())]

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedFilter === 'all' || order.status.toLowerCase() === selectedFilter
    const matchesSearch =
      `ORD-${String(order.id).padStart(3, '0')}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(i => i.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    const map = {
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      SHIPPED: 'bg-blue-100 text-blue-800 border-blue-200',
    }
    return map[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />
      case 'PROCESSING': return <RefreshCw className="w-4 h-4" />
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4" />
      case 'SHIPPED': return <Truck className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const getPaymentBadgeColor = (paymentStatus) => {
    const map = {
      PAID: 'bg-green-100 text-green-800',
      UNPAID: 'bg-yellow-100 text-yellow-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    }
    return map[paymentStatus] || 'bg-gray-100 text-gray-800'
  }

  const formatKES = (amount) =>
    `KES ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric', month: 'short', day: 'numeric',
    })

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <Layout title="Orders" subtitle="Keep track of all customer orders">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  Orders
                </h1>
                <p className="text-sm text-gray-600 mt-1">Manage and track all customer orders</p>
              </div>
              <button
                onClick={fetchOrders}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                    <stat.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg capitalize whitespace-nowrap transition-all ${selectedFilter === filter
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 lg:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full lg:w-72"
                  />
                </div>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedFilter('all') }}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Clear filters"
                >
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(8)].map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          ORD-{String(order.id).padStart(3, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-xs font-semibold text-white">
                              {getInitials(order.userName)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 font-medium">{order.userName}</p>
                            <p className="text-xs text-gray-500">{order.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{formatKES(order.totalAmount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentBadgeColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Inline status dropdown */}
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingStatus === order.id}
                            className={`inline-flex items-center gap-1.5 pl-2 pr-6 py-1.5 rounded-full text-xs font-medium border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 ${getStatusColor(order.status)}`}
                          >
                            {ORDER_STATUSES.map(s => (
                              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setSelectedOrder(order); setShowOrderDetails(true) }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {!loading && filteredOrders.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Package className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-sm text-gray-600">
                  {searchTerm || selectedFilter !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'No orders have been placed yet'}
                </p>
              </div>
            )}

            {/* Footer count */}
            {!loading && filteredOrders.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
                  <span className="font-medium">{orders.length}</span> orders
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    ORD-{String(selectedOrder.id).padStart(3, '0')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button onClick={() => setShowOrderDetails(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Customer + Status */}
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.userName}</p>
                    <p className="text-xs text-gray-500">{selectedOrder.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Status</p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">
                      {PAYMENT_LABELS[selectedOrder.paymentMethod] ?? selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentBadgeColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Items Ordered</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                        <div className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={`http://localhost:8080/images/${item.productImageFileName}`}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.src = '/placeholder.png' }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">{formatKES(item.unitPrice)} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{formatKES(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shippingFullName}<br />
                    {selectedOrder.shippingPhone}<br />
                    {selectedOrder.shippingAddress}<br />
                    {selectedOrder.shippingCity}, {selectedOrder.shippingCounty}
                  </p>
                  {selectedOrder.orderNotes && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700">
                        <span className="font-semibold">Note: </span>{selectedOrder.orderNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">{formatKES(selectedOrder.totalAmount)}</span>
                </div>

                {/* Status update from modal */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedOrder.id, s)}
                        disabled={selectedOrder.status === s || updatingStatus === selectedOrder.id}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${selectedOrder.status === s
                            ? getStatusColor(s)
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Orders