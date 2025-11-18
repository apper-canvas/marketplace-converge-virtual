import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const CartItem = ({ 
  item, 
  product,
  onUpdateQuantity, 
  onRemove,
  className = "" 
}) => {
  const [isRemoving, setIsRemoving] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove()
    } else if (newQuantity <= product.stockCount) {
      onUpdateQuantity(item.productId, newQuantity)
    }
  }

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(item.productId)
    }, 200)
  }

  const subtotal = product.price * item.quantity

  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg shadow-card p-4 transition-all duration-200",
        isRemoving && "opacity-50 scale-95",
        className
      )}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="flex gap-4">
        <Link to={`/product/${product.id}`} className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={product.images[0]}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </Link>

        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start">
            <Link 
              to={`/product/${product.id}`}
              className="font-medium text-primary hover:text-accent transition-colors duration-200"
            >
              {product.title}
            </Link>
            <button
              onClick={handleRemove}
              className="text-secondary hover:text-error transition-colors duration-200 p-1"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-accent font-bold">${product.price.toFixed(2)}</span>
              {item.quantity > 1 && (
                <span className="text-sm text-secondary">
                  each
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="quantity-button rounded-l"
                disabled={isRemoving}
              >
                <ApperIcon name="Minus" size={14} />
              </button>
              <span className="px-3 py-1 border-t border-b border-gray-300 min-w-12 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="quantity-button rounded-r"
                disabled={item.quantity >= product.stockCount || isRemoving}
              >
                <ApperIcon name="Plus" size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-secondary">
              Subtotal: <span className="font-medium text-primary">${subtotal.toFixed(2)}</span>
            </span>
            {item.quantity >= product.stockCount && (
              <span className="text-xs text-warning">Max quantity reached</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem