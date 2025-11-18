import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ 
  className = "", 
  error = "Something went wrong", 
  onRetry,
  title = "Oops! Something went wrong"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-6", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" size={40} className="text-error" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
        <p className="text-secondary max-w-md">{error}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={16} />
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorView