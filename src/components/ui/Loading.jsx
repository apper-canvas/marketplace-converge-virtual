import { cn } from "@/utils/cn"

const Loading = ({ className = "", variant = "default" }) => {
  if (variant === "products") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-card p-4 space-y-4">
            <div className="skeleton h-48 rounded-md" />
            <div className="space-y-2">
              <div className="skeleton h-4 rounded w-3/4" />
              <div className="skeleton h-4 rounded w-1/2" />
            </div>
            <div className="flex items-center justify-between">
              <div className="skeleton h-6 rounded w-16" />
              <div className="skeleton h-8 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "product-detail") {
    return (
      <div className={cn("max-w-6xl mx-auto px-4 py-8", className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="skeleton h-96 rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton h-20 rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="skeleton h-8 rounded w-3/4" />
            <div className="skeleton h-6 rounded w-1/2" />
            <div className="skeleton h-4 rounded w-full" />
            <div className="skeleton h-4 rounded w-5/6" />
            <div className="skeleton h-4 rounded w-4/5" />
            <div className="skeleton h-12 rounded w-32" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="text-center space-y-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-secondary">Loading...</p>
      </div>
    </div>
  )
}

export default Loading