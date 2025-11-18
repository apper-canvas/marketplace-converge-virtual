import ApperIcon from "@/components/ApperIcon"

const LoadingSpinner = ({ 
  className = "", 
  size = 32, 
  message = "Loading..." 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-background ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
          <div className="animate-spin">
            <ApperIcon name="Loader2" size={size} className="text-primary" />
          </div>
        </div>
        <p className="text-secondary text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner