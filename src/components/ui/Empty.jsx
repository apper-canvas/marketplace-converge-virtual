import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  className = "", 
  message = "No items found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  actionLabel = "Start Shopping",
  onAction,
  icon = "ShoppingBag"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-6", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} size={40} className="text-secondary" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-primary">{message}</h3>
        <p className="text-secondary max-w-md">{description}</p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default Empty