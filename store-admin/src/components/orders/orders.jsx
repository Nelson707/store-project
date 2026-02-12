import React, { useState } from 'react'
import Layout from '../component/layout'
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
  AlertCircle,
  Eye,
  Download,
  Package,
  Users
} from 'lucide-react'

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    { name: 'Total Orders', value: '156', change: '+12%', icon: ShoppingBag, color: 'bg-blue-500' },
    { name: 'Pending', value: '23', change: '-2%', icon: Clock, color: 'bg-yellow-500' },
    { name: 'Processing', value: '45', change: '+5%', icon: RefreshCw, color: 'bg-purple-500' },
    { name: 'Delivered', value: '78', change: '+18%', icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Cancelled', value: '10', change: '-8%', icon: XCircle, color: 'bg-red-500' },
  ]

  const orders = [
    {
      id: '#ORD-12345',
      customer: 'John Smith',
      date: '2024-01-15',
      total: 299.99,
      status: 'delivered',
      items: 3,
      payment: 'Paid',
      shipping: 'Express',
    },
    {
      id: '#ORD-12346',
      customer: 'Sarah Johnson',
      date: '2024-01-16',
      total: 149.50,
      status: 'processing',
      items: 2,
      payment: 'Paid',
      shipping: 'Standard',
    },
    {
      id: '#ORD-12347',
      customer: 'Mike Williams',
      date: '2024-01-16',
      total: 599.99,
      status: 'pending',
      items: 5,
      payment: 'Pending',
      shipping: 'Express',
    },
    {
      id: '#ORD-12348',
      customer: 'Emma Brown',
      date: '2024-01-15',
      total: 89.99,
      status: 'cancelled',
      items: 1,
      payment: 'Refunded',
      shipping: 'Standard',
    },
    {
      id: '#ORD-12349',
      customer: 'David Lee',
      date: '2024-01-14',
      total: 445.00,
      status: 'shipped',
      items: 4,
      payment: 'Paid',
      shipping: 'Next Day',
    },
    {
      id: '#ORD-12350',
      customer: 'Lisa Anderson',
      date: '2024-01-17',
      total: 178.50,
      status: 'processing',
      items: 2,
      payment: 'Paid',
      shipping: 'Standard',
    },
  ]

  const getStatusColor = (status) => {
    const statusColors = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'processing':
        return <RefreshCw className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

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
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track all customer orders
                </p>
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Orders
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
                    <p className={`text-xs mt-2 font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} vs last month
                    </p>
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
              {/* Filter Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-gray-200">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg capitalize whitespace-nowrap transition-all ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 lg:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full lg:w-72"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                    <th className="px-6 py-4 text-left w-10">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                        />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Shipping
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-xs font-semibold text-white">
                              {getInitials(order.customer)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{order.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{order.items} items</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                          order.payment === 'Paid' 
                            ? 'bg-green-100 text-green-800'
                            : order.payment === 'Refunded'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{order.shipping}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                            title="More Options"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Package className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-sm text-gray-600">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
                  <span className="font-medium">24</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                    1
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <span className="px-2 py-1.5 text-sm text-gray-600">...</span>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    8
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Orders