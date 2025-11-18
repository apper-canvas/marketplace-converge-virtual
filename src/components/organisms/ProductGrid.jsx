import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null,
  onRetry,
  className = "",
  viewMode = "grid", // "grid" or "list"
  setViewMode // Function to update view mode
}) => {
  const [sortBy, setSortBy] = useState("featured")
  const [sortedProducts, setSortedProducts] = useState([])
  const { addItem, isInCart } = useCart()

  useEffect(() => {
    let sorted = [...products]
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // Assuming products have a created date or id for newest
        sorted.sort((a, b) => b.id - a.id)
        break
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        // Keep original order for "featured"
        break
    }
    
    setSortedProducts(sorted)
  }, [products, sortBy])

  if (loading) {
    return <Loading variant="products" className={className} />
  }

if (error) {
    return (
      <ErrorView
        error={typeof error === 'string' ? error : (error?.message || 'An error occurred while loading products')}
        onRetry={onRetry}
        className={className}
      />
    )
  }

  if (sortedProducts.length === 0) {
    return (
      <Empty
        message="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
        icon="Search"
        className={className}
      />
    )
  }

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
    { value: "name", label: "Name A-Z" }
  ]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Sort and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-secondary">
          Showing {sortedProducts.length} products
        </p>
        
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-secondary">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

{/* View Mode Toggle */}
          {setViewMode && (
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors duration-200",
                  viewMode === "grid" ? "bg-primary text-white" : "text-secondary hover:bg-gray-100"
                )}
              >
                <ApperIcon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors duration-200",
                  viewMode === "list" ? "bg-primary text-white" : "text-secondary hover:bg-gray-100"
                )}
              >
                <ApperIcon name="List" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${sortBy}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                onAddToCart={addItem}
                isInCart={isInCart(product.id)}
                className={viewMode === "list" ? "flex-row" : ""}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ProductGrid