import React, { useState, useEffect } from 'react';
import Layout from '../component/layout';
import api from '../../api/axios';
import {
    Receipt,
    Search,
    Filter,
    Calendar,
    Download,
    Eye,
    Printer,
    ChevronLeft,
    ChevronRight,
    X,
    TrendingUp,
    DollarSign,
    ShoppingBag,
    CreditCard,
    Clock,
    User,
    Package,
    RefreshCw
} from 'lucide-react';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [dateFilter, setDateFilter] = useState('today'); // today, week, month, custom
    const [customDateRange, setCustomDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        cashSales: 0,
        cardSales: 0,
        mpesaSales: 0
    });

    // Fetch sales on component mount and when filters change
    useEffect(() => {
        fetchSales();
    }, [dateFilter, customDateRange.startDate, customDateRange.endDate]);

    const fetchSales = async () => {
        setLoading(true);
        try {
            let url = '/sales';

            // Add date filter to URL
            if (dateFilter === 'today') {
                url = '/sales/today';
            } else if (dateFilter === 'week') {
                // You might need to create this endpoint
                url = '/sales/week';
            } else if (dateFilter === 'month') {
                // You might need to create this endpoint
                url = '/sales/month';
            } else if (dateFilter === 'custom' && customDateRange.startDate && customDateRange.endDate) {
                url = `/sales/range?start=${customDateRange.startDate}&end=${customDateRange.endDate}`;
            }

            const response = await api.get(url);

            // Handle different response structures
            let salesData = [];
            if (Array.isArray(response.data)) {
                salesData = response.data;
            } else if (response.data.sales) {
                salesData = response.data.sales;
            }

            setSales(salesData);
            calculateStats(salesData);
        } catch (error) {
            console.error('Error fetching sales:', error);
            // Fallback to get all sales if specific endpoint fails
            try {
                const response = await api.get('/sales');
                setSales(response.data);
                calculateStats(response.data);
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (salesData) => {
        const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const cashSales = salesData.filter(s => s.paymentMethod === 'CASH').length;
        const cardSales = salesData.filter(s => s.paymentMethod === 'CARD').length;
        const mpesaSales = salesData.filter(s => s.paymentMethod === 'MPESA').length;

        setStats({
            totalSales: salesData.length,
            totalRevenue: totalRevenue,
            averageOrderValue: salesData.length > 0 ? totalRevenue / salesData.length : 0,
            cashSales,
            cardSales,
            mpesaSales
        });
    };

    const viewSaleDetails = async (sale) => {
        try {
            // If we already have items, use them
            if (sale.items && sale.items.length > 0) {
                setSelectedSale(sale);
                setShowDetailModal(true);
            } else {
                // Otherwise fetch full details
                const response = await api.get(`/sales/${sale.id}`);
                setSelectedSale(response.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            console.error('Error fetching sale details:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Filter sales based on search and payment method
    const filteredSales = sales.filter(sale => {
        const matchesSearch =
            sale.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.id?.toString().includes(searchTerm);

        const matchesPayment = paymentMethodFilter === 'all' ||
            sale.paymentMethod === paymentMethodFilter;

        return matchesSearch && matchesPayment;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const exportToCSV = () => {
        const headers = ['Invoice #', 'Date', 'Payment Method', 'Items', 'Total Amount', 'Amount Paid', 'Change'];
        const csvData = filteredSales.map(sale => [
            sale.invoiceNumber,
            new Date(sale.createdAt).toLocaleString(),
            sale.paymentMethod,
            sale.items?.length || 0,
            sale.totalAmount,
            sale.amountPaid,
            sale.amountPaid - sale.totalAmount
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const printReceipt = (sale) => {
        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${sale.invoiceNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>FreshPOS</h2>
              <p>Invoice: ${sale.invoiceNumber}</p>
              <p>Date: ${formatDate(sale.createdAt)}</p>
            </div>
            <div class="items">
              ${sale.items?.map(item => `
                <div class="item">
                  <span>${item.productName || item.product?.name} x${item.quantity}</span>
                  <span>${formatCurrency(item.subTotal)}</span>
                </div>
              `).join('')}
            </div>
            <div class="total">
              <div class="item"><strong>Subtotal:</strong> <span>${formatCurrency(sale.totalAmount)}</span></div>
              <div class="item"><strong>Payment:</strong> <span>${sale.paymentMethod}</span></div>
              <div class="item"><strong>Amount Paid:</strong> <span>${formatCurrency(sale.amountPaid)}</span></div>
              <div class="item"><strong>Change:</strong> <span>${formatCurrency(sale.amountPaid - sale.totalAmount)}</span></div>
            </div>
            <div class="footer">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </body>
      </html>
    `);
        receiptWindow.document.close();
        receiptWindow.print();
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
                                <p className="text-sm text-gray-500">View and manage all sales transactions</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchSales}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">Total Sales</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                        <p className="text-xs text-gray-500 mt-1">All transactions</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">Revenue</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-xs text-gray-500 mt-1">Total income</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">Avg. Order</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                        <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-yellow-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">Payment Split</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs flex justify-between">
                                <span>Cash:</span>
                                <span className="font-medium">{stats.cashSales}</span>
                            </p>
                            <p className="text-xs flex justify-between">
                                <span>Card:</span>
                                <span className="font-medium">{stats.cardSales}</span>
                            </p>
                            <p className="text-xs flex justify-between">
                                <span>M-PESA:</span>
                                <span className="font-medium">{stats.mpesaSales}</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">Items Sold</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {sales.reduce((sum, sale) => sum + (sale.items?.length || 0), 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total items</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white px-6 py-4 border-t border-b border-gray-200">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Date Filter */}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {/* Custom Date Range */}
                        {dateFilter === 'custom' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={customDateRange.startDate}
                                    onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    value={customDateRange.endDate}
                                    onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        )}

                        {/* Payment Method Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={paymentMethodFilter}
                                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Payments</option>
                                <option value="CASH">Cash</option>
                                <option value="CARD">Card</option>
                                <option value="MPESA">M-PESA</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by invoice number or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="p-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : currentSales.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                No sales found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentSales.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm font-medium text-blue-600">
                                                        {sale.invoiceNumber}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatDate(sale.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${sale.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' :
                                                            sale.paymentMethod === 'CARD' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-orange-100 text-orange-800'}`}>
                                                        {sale.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {sale.items?.length || 0} items
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                    {formatCurrency(sale.totalAmount)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatCurrency(sale.amountPaid)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatCurrency(sale.amountPaid - sale.totalAmount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => viewSaleDetails(sale)}
                                                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => printReceipt(sale)}
                                                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="Print Receipt"
                                                        >
                                                            <Printer className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!loading && filteredSales.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSales.length)} of {filteredSales.length} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                        ${currentPage === number
                                                    ? 'bg-blue-600 text-white'
                                                    : 'hover:bg-gray-100 text-gray-700'}`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sale Details Modal */}
                {showDetailModal && selectedSale && (
                    <>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setShowDetailModal(false)}
                        ></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Receipt className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Sale Details</h2>
                                            <p className="text-sm text-gray-500">Invoice: {selectedSale.invoiceNumber}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Sale Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDate(selectedSale.createdAt)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedSale.paymentMethod}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                                    <div className="space-y-2 mb-6">
                                        {selectedSale.items?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {item.productName || item.product?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.quantity} x {formatCurrency(item.unitPrice)}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(item.subTotal)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(selectedSale.totalAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Amount Paid</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(selectedSale.amountPaid)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Change</span>
                                            <span className="font-medium text-green-600">{formatCurrency(selectedSale.amountPaid - selectedSale.totalAmount)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => printReceipt(selectedSale)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print Receipt
                                        </button>
                                        <button
                                            onClick={() => setShowDetailModal(false)}
                                            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Sales;