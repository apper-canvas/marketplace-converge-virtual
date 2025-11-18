import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import CartItem from "@/components/molecules/CartItem"
import Button from "@/components/atoms/Button"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { useCart } from "@/hooks/useCart"

const Cart = () => {
  const navigate = useNavigate()
  const { items, products, updateQuantity, removeItem, getTotal, getTotalItems, clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsClearing(true)
      setTimeout(() => {
        clearCart()
        setIsClearing(false)
        toast.success("Cart cleared successfully")
      }, 300)
    }
  }

  const handleContinueShopping = () => {
    navigate("/products")
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  const subtotal = getTotal()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax
  const totalItems = getTotalItems()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>
          <Empty
            message="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet. Start shopping to find amazing products!"
            actionLabel="Start Shopping"
            onAction={handleContinueShopping}
            icon="ShoppingCart"
            className="py-16"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-error hover:text-red-600 transition-colors duration-200 flex items-center gap-2"
            >
              <ApperIcon name="Trash2" size={16} />
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const product = products.find(p => p.id === item.productId)
                if (!product) return null
                
                return (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CartItem
                      item={item}
                      product={product}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Continue Shopping */}
            <div className="pt-6">
              <Link to="/products">
                <Button variant="outline" className="flex items-center gap-2">
                  <ApperIcon name="ArrowLeft" size={16} />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-primary mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Subtotal ({totalItems} items)</span>
                  <span className="text-primary font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Shipping</span>
                  <span className="text-primary font-medium">
                    {shipping === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Tax</span>
                  <span className="text-primary font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-primary">Total</span>
                    <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && subtotal < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <ApperIcon name="Info" size={16} />
                    <span className="font-medium">Free Shipping Available</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Add ${(50 - subtotal).toFixed(2)} more to your order to qualify for free shipping!
                  </p>
                </div>
              )}

              <Button onClick={handleCheckout} className="w-full flex items-center justify-center gap-2">
                <ApperIcon name="CreditCard" size={16} />
                Proceed to Checkout
              </Button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-secondary mb-2">
                  <ApperIcon name="Shield" size={16} />
                  <span>Secure checkout guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary mb-2">
                  <ApperIcon name="RotateCcw" size={16} />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <ApperIcon name="Truck" size={16} />
                  <span>Fast & reliable shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart