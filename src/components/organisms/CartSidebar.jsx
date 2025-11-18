import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import CartItem from "@/components/molecules/CartItem"
import Button from "@/components/atoms/Button"
import Empty from "@/components/ui/Empty"
import { useCart } from "@/hooks/useCart"

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, products, updateQuantity, removeItem, getTotal, getTotalItems, clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 300)
  }

  const total = getTotal()
  const totalItems = getTotalItems()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-primary">
                Shopping Cart ({totalItems})
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-secondary hover:text-primary transition-colors duration-200"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <Empty
                  message="Your cart is empty"
                  description="Add some products to get started!"
                  actionLabel="Start Shopping"
                  onAction={() => {
                    onClose()
                    // Navigate to products page
                  }}
                  icon="ShoppingCart"
                />
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => {
                      const product = products.find(p => p.id === item.productId)
                      if (!product) return null
                      
                      return (
                        <CartItem
                          key={item.productId}
                          item={item}
                          product={product}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeItem}
                        />
                      )
                    })}
                  </AnimatePresence>

                  {/* Clear Cart Button */}
                  {items.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      disabled={isClearing}
                      className="w-full text-center text-sm text-error hover:text-red-600 transition-colors duration-200 py-2"
                    >
                      <ApperIcon name="Trash2" size={16} className="inline mr-2" />
                      Clear Cart
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">Total:</span>
                  <span className="text-xl font-bold text-accent">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Link to="/cart" onClick={onClose} className="block">
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={onClose} className="block">
                    <Button className="w-full">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CartSidebar