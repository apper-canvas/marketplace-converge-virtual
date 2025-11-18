import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const ProductCard = ({ 
  product, 
  className = "", 
  onAddToCart,
  isInCart = false 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? "star-filled" : "star-empty"}
        fill={index < Math.floor(rating) ? "currentColor" : "none"}
      />
    ))
  }

  const hasDiscount = product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      className={cn(
        "product-card bg-white rounded-lg shadow-card overflow-hidden group relative",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square bg-gray-100 relative">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={product.images[0]}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover product-image transition-all duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {hasDiscount && (
              <Badge 
                variant="accent" 
                className="absolute top-2 left-2 savings-badge"
              >
                -{discountPercentage}%
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="error">Out of Stock</Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Quick Add Overlay */}
        <div className="quick-add-overlay">
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={!product.inStock || isInCart}
            className={cn(
              "bg-white text-primary px-4 py-2 rounded-lg font-medium transition-all duration-200",
              "hover:bg-gray-100 active:scale-95 flex items-center gap-2",
              (!product.inStock || isInCart) && "opacity-50 cursor-not-allowed"
            )}
          >
            <ApperIcon name={isInCart ? "Check" : "ShoppingCart"} size={16} />
            {isInCart ? "Added" : "Quick Add"}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-primary hover:text-accent transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-secondary">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="price-original">${product.originalPrice.toFixed(2)}</span>
            )}
            <span className={cn(
              "font-bold text-lg",
              hasDiscount ? "price-sale" : "text-primary"
            )}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={!product.inStock || isInCart}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              product.inStock && !isInCart 
                ? "bg-accent text-white hover:bg-red-600 active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <ApperIcon name={isInCart ? "Check" : "Plus"} size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard