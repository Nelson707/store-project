import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/layout";

const formatKES = (amount) => `KES ${Number(amount).toLocaleString("en-KE")}`;

const PAYMENT_LABELS = {
    CASH_ON_DELIVERY: "Cash on Delivery",
    MPESA: "M-Pesa",
    CREDIT_CARD: "Credit / Debit Card",
    BANK_TRANSFER: "Bank Transfer",
};

const STATUS_STYLES = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
};

export default function OrderConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    // Guard: if user navigated here directly without order data
    if (!order) {
        return (
            <Layout title="Order Not Found">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No order found</h2>
                    <p className="text-gray-500 mb-6">It looks like you arrived here without placing an order.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        Continue Shopping
                    </button>
                </div>
            </Layout>
        );
    }

    const createdDate = new Date(order.createdAt).toLocaleDateString("en-KE", {
        year: "numeric", month: "long", day: "numeric",
    });

    return (
        <Layout title="Order Confirmed">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
                        Thank you, {order.shippingFullName.split(" ")[0]}!
                    </h1>
                    <p className="text-gray-500">
                        Your order has been placed and is being processed.
                    </p>
                </div>

                {/* Order Card */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                    {/* Order Meta */}
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Order ID</p>
                            <p className="text-sm font-semibold text-gray-900">#{order.id}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Date</p>
                            <p className="text-sm text-gray-900">{createdDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Payment</p>
                            <p className="text-sm text-gray-900">
                                {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Items Ordered</h3>
                        <div className="space-y-4 divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={`http://localhost:8080/images/${item.productImageFileName}`}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {item.productName}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatKES(item.unitPrice)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                        {formatKES(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-5 pt-5 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-900">Total Paid</span>
                            <span className="text-xl font-bold text-gray-900">
                                {formatKES(order.totalAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Details</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.shippingFullName}</p>
                            <p>{order.shippingPhone}</p>
                            <p>{order.shippingAddress}</p>
                            <p>{order.shippingCity}, {order.shippingCounty}</p>
                        </div>
                        {order.orderNotes && (
                            <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                <p className="text-xs text-yellow-700">
                                    <span className="font-semibold">Note: </span>
                                    {order.orderNotes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate("/products")}
                        className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors text-sm"
                    >
                        Continue Shopping
                    </button>
                    <Link
                        to="/orders"
                        className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm text-center"
                    >
                        View My Orders
                    </Link>
                </div>
            </div>
        </Layout>
    );
}