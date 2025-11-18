import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const FilterSection = ({ 
  title, 
  children, 
  isOpen = true, 
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen)

  return (
    <div className={cn("border-b border-gray-200 pb-4", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <h3 className="font-medium text-primary">{title}</h3>
        <ApperIcon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-secondary transition-transform duration-200"
        />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CategoryFilter = ({ categories, selectedCategories, onChange }) => {
  return (
    <FilterSection title="Categories">
      <div className="space-y-2">
        {categories.map((category) => (
          <label key={category} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selectedCategories, category])
                } else {
                  onChange(selectedCategories.filter(c => c !== category))
                }
              }}
              className="rounded border-gray-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-primary">{category}</span>
          </label>
        ))}
      </div>
    </FilterSection>
  )
}

const PriceFilter = ({ priceRange, onChange, min = 0, max = 1000 }) => {
  const [localRange, setLocalRange] = useState(priceRange)

  const handleRangeChange = (index, value) => {
    const newRange = [...localRange]
    newRange[index] = parseInt(value)
    setLocalRange(newRange)
    onChange(newRange)
  }

  return (
    <FilterSection title="Price Range">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <span>${localRange[0]}</span>
          <span className="text-secondary">-</span>
          <span>${localRange[1]}</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-secondary">Min Price</label>
            <input
              type="range"
              min={min}
              max={max}
              value={localRange[0]}
              onChange={(e) => handleRangeChange(0, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="text-xs text-secondary">Max Price</label>
            <input
              type="range"
              min={min}
              max={max}
              value={localRange[1]}
              onChange={(e) => handleRangeChange(1, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </FilterSection>
  )
}

const RatingFilter = ({ minRating, onChange }) => {
  const renderStars = (rating, isSelected) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={14}
        className={index < rating ? "star-filled" : "star-empty"}
        fill={index < rating ? "currentColor" : "none"}
      />
    ))
  }

  return (
    <FilterSection title="Rating">
      <div className="space-y-2">
        {[4, 3, 2, 1].map((rating) => (
          <label key={rating} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === rating}
              onChange={() => onChange(rating)}
              className="text-accent focus:ring-accent"
            />
            <div className="flex items-center gap-1">
              {renderStars(rating)}
              <span className="text-sm text-secondary ml-1">& up</span>
            </div>
          </label>
        ))}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="rating"
            checked={minRating === 0}
            onChange={() => onChange(0)}
            className="text-accent focus:ring-accent"
          />
          <span className="text-sm text-primary">All ratings</span>
        </label>
      </div>
    </FilterSection>
  )
}

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const hasFilters = filters.categories.length > 0 || 
                    filters.priceRange[0] > 0 || 
                    filters.priceRange[1] < 1000 || 
                    filters.minRating > 0 ||
                    filters.inStockOnly

  if (!hasFilters) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-primary">Active Filters</h3>
        <button
          onClick={onClearAll}
          className="text-sm text-accent hover:text-red-600 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.categories.map((category) => (
          <Badge 
            key={category}
            variant="primary" 
            className="filter-tag cursor-pointer"
            onClick={() => onRemoveFilter("category", category)}
          >
            {category}
            <ApperIcon name="X" size={12} />
          </Badge>
        ))}
        
        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
          <Badge 
            variant="primary" 
            className="filter-tag cursor-pointer"
            onClick={() => onRemoveFilter("price")}
          >
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
            <ApperIcon name="X" size={12} />
          </Badge>
        )}
        
        {filters.minRating > 0 && (
          <Badge 
            variant="primary" 
            className="filter-tag cursor-pointer"
            onClick={() => onRemoveFilter("rating")}
          >
            {filters.minRating}+ stars
            <ApperIcon name="X" size={12} />
          </Badge>
        )}
        
        {filters.inStockOnly && (
          <Badge 
            variant="primary" 
            className="filter-tag cursor-pointer"
            onClick={() => onRemoveFilter("stock")}
          >
            In Stock Only
            <ApperIcon name="X" size={12} />
          </Badge>
        )}
      </div>
    </div>
  )
}

export { FilterSection, CategoryFilter, PriceFilter, RatingFilter, ActiveFilters }