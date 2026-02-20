import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/layout";
import api from "../../api/axios";
import { toastify } from "../../utils/toast";
import { useCart } from "../../context/CartContext";

const formatKES = (amount) => `KES ${Number(amount).toLocaleString("en-KE")}`;

const PAYMENT_METHODS = [
    {
        value: "CASH_ON_DELIVERY",
        label: "Cash on Delivery",
        description: "Pay when your order arrives",
        icon: "💵",
    },
    {
        value: "MPESA",
        label: "M-Pesa",
        description: "Pay via Safaricom M-Pesa",
        icon: "📱",
    },
    {
        value: "CREDIT_CARD",
        label: "Credit / Debit Card",
        description: "Visa, Mastercard accepted",
        icon: "💳",
    },
    {
        value: "BANK_TRANSFER",
        label: "Bank Transfer",
        description: "Direct bank deposit",
        icon: "🏦",
    },
];

const KENYAN_COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
    "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
    "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
    "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
    "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
    "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia",
    "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

const initialFormState = {
    shippingFullName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingCounty: "",
    paymentMethod: "CASH_ON_DELIVERY",
    orderNotes: "",
};

export default function Checkout() {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ── Redirect if cart is empty ────────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <Layout title="Checkout">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some products before checking out.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Shop Now
                    </button>
                </div>
            </Layout>
        );
    }

    // ── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const newErrors = {};
        if (!form.shippingFullName.trim()) newErrors.shippingFullName = "Full name is required";
        if (!form.shippingPhone.trim()) {
            newErrors.shippingPhone = "Phone number is required";
        } else if (!/^(\+254|0)[17]\d{8}$/.test(form.shippingPhone)) {
            newErrors.shippingPhone = "Enter a valid Kenyan phone number (e.g. 0712345678)";
        }
        if (!form.shippingAddress.trim()) newErrors.shippingAddress = "Address is required";
        if (!form.shippingCity.trim()) newErrors.shippingCity = "City/Town is required";
        if (!form.shippingCounty) newErrors.shippingCounty = "County is required";
        if (!form.paymentMethod) newErrors.paymentMethod = "Select a payment method";
        return newErrors;
    };

    // ── Field change ─────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await api.post("/orders", payload);
            clearCart();
            navigate("/order-confirmation", { state: { order: response.data } });
        } catch (error) {
            const message =
                error?.response?.data?.message || "Failed to place order. Please try again.";
            toastify(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Checkout">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Cart
                    </button>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Checkout</span>
                </nav>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* ── Left: Form ─────────────────────────────────────── */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* Shipping Info */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Shipping Information
                                </h2>
                                <div className="space-y-5">
                                    <FormField
                                        label="Full Name"
                                        name="shippingFullName"
                                        value={form.shippingFullName}
                                        onChange={handleChange}
                                        error={errors.shippingFullName}
                                        placeholder="John Doe"
                                    />
                                    <FormField
                                        label="Phone Number"
                                        name="shippingPhone"
                                        type="tel"
                                        value={form.shippingPhone}
                                        onChange={handleChange}
                                        error={errors.shippingPhone}
                                        placeholder="0712 345 678"
                                    />
                                    <FormField
                                        label="Delivery Address"
                                        name="shippingAddress"
                                        value={form.shippingAddress}
                                        onChange={handleChange}
                                        error={errors.shippingAddress}
                                        placeholder="Street, Building, Apartment..."
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <FormField
                                            label="City / Town"
                                            name="shippingCity"
                                            value={form.shippingCity}
                                            onChange={handleChange}
                                            error={errors.shippingCity}
                                            placeholder="Nairobi"
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                County <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="shippingCounty"
                                                value={form.shippingCounty}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
                                                    errors.shippingCounty
                                                        ? "border-red-400 focus:ring-red-300"
                                                        : "border-gray-300 focus:ring-gray-400"
                                                }`}
                                            >
                                                <option value="">Select county...</option>
                                                {KENYAN_COUNTIES.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            {errors.shippingCounty && (
                                                <p className="mt-1 text-xs text-red-500">{errors.shippingCounty}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Order Notes <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <textarea
                                            name="orderNotes"
                                            value={form.orderNotes}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Special instructions for delivery, gate codes, etc."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Payment Method
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <label
                                            key={method.value}
                                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                                                form.paymentMethod === method.value
                                                    ? "border-gray-900 bg-gray-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.value}
                                                checked={form.paymentMethod === method.value}
                                                onChange={handleChange}
                                                className="mt-0.5 accent-gray-900"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{method.icon}</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {method.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {method.description}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.paymentMethod && (
                                    <p className="mt-2 text-xs text-red-500">{errors.paymentMethod}</p>
                                )}
                            </section>
                        </div>

                        {/* ── Right: Order Summary ────────────────────────────── */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 pt-4 first:pt-0">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={`http://localhost:8080/images/${item.imageFileName}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {formatKES(item.price)} × {item.quantity}
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                {formatKES(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 mt-5 pt-5 space-y-3">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatKES(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>{formatKES(totalPrice)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 w-full py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Placing Order...
                                        </>
                                    ) : (
                                        "Place Order"
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-3">
                                    🔒 Your information is secure
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

// ── Reusable Field ─────────────────────────────────────────────────────────────

function FormField({ label, name, type = "text", value, onChange, error, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} <span className="text-red-500">*</span>
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    error
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-gray-400"
                }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}