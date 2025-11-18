import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className = "", 
  placeholder = "Search products...",
  onSearch,
  value = "",
  onChange
}) => {
const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
<div className={cn(
        "relative flex items-center transition-all duration-200"
      )}>
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 text-secondary z-10" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
className={cn(
            "w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg",
            "focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20",
            "transition-all duration-200 bg-white",
            className
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange && onChange("")}
            className="absolute right-3 text-secondary hover:text-primary transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar