import React, { useState, useEffect } from 'react'
import Layout from '../component/layout'
import api from '../../api/axios'
import { Link } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  User,
  X,
  Receipt,
  Percent,
  ShoppingBag,
  LogOut,
  Clock
} from 'lucide-react'

const POSHome = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [showCart, setShowCart] = useState(false)

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.id === selectedCategory

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })


  const fetchProducts = () => {
    api.get("/products")
      .then(res => {
        setProducts(res.data);
        console.log("Products", res.data)
      })
      .catch(err => console.error(err))
  };

  const fetchCategories = () => {
    api.get("/categories")
      .then(res => {
        setCategories(res.data)
        console.log("Categories", res.data)
      })
      .catch(err => console.error(err));
  };


  // Cart functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar - Store Info & Cashier */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">FreshPOS</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Store Open</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Cashier</p>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">JD</span>
                </div>
              </div>

              {/* Cart Icon Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Full Width - Products */}
          <div className="w-full flex flex-col">
            {/* Category Tabs */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  key="all"
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === "all"
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  All
                </button>

                {categories.map((category) => {
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white px-6 py-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm
                      ? 'No products found'
                      : selectedCategory !== 'all'
                        ? 'No products in this category'
                        : 'No products yet'
                    }
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
                    >
                      <img
                        src={`/images/${product.imageFileName}`}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                      <h3 className="font-medium text-gray-900 text-left">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-blue-600">
                          KES {product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowCart(false)}
            ></div>

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col">
              {/* Customer Info Bar */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={() => setCustomer(customer ? null : { name: 'Walk-in Customer' })}
                  className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {customer ? customer.name : 'Walk-in Customer'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {customer ? 'Member since 2024' : 'Select customer'}
                    </p>
                  </div>
                  {!customer && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      Add
                    </span>
                  )}
                </button>
              </div>

              {/* Cart Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                    <h2 className="font-semibold text-gray-900">Current Order</h2>
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {cart.length} items
                    </span>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-2">Cart is empty</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Add items from the product grid to start a new order
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                          {item.image}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">KES {item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            KES {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">KES {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium text-gray-900">KES {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">KES {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Percent className="w-4 h-4" />
                    Discount
                  </button>
                  <button
                    onClick={() => cart.length > 0 && setShowPayment(true)}
                    disabled={cart.length === 0}
                    className={`flex-1 bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${cart.length === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                      }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
                <button
                  onClick={() => setShowPayment(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  KES {total.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-colors">
                  <CreditCard className="w-5 h-5" />
                  Pay with Card
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-colors">
                  <Receipt className="w-5 h-5" />
                  Cash Payment
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Order will be processed and receipt will be generated
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default POSHome
